import { Cookie, createCookieSessionStorage, createSessionStorage, redirect, SessionData } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";
import { prisma } from "~/db.server";
import { DateTime } from "luxon";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  return session.get(USER_SESSION_KEY);
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function isLoggedIn(request: Request) {
  const userId = await getUserId(request);

  return !!userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

// @ts-ignore
export function createDatabaseSessionStorage({ cookie }) {
  return createSessionStorage({
    cookie,
    async createData(sessionData: SessionData, expires) {
      const session = await prisma.session.create({
        data: {
          data: JSON.stringify(sessionData),
        },
      });
      return session.id;
    },
    async readData(id: string) {
      const session = await prisma.session.findUnique({
        where: {
          id,
        },
      });

      if (session) {
        return JSON.parse(session.data);
      } else return null;
    },
    async updateData(id, sessionData, expires) {
      const string = JSON.stringify(sessionData);
      if (expires && DateTime.fromJSDate(expires) < DateTime.now()) {
        await prisma.session.delete({
          where: {
            id,
          },
        });
      } else {
        await prisma.session.upsert({
          where: {
            id,
          },
          update: {
            data: string,
          },
          create: {
            data: string,
          },
        });
      }
    },
    async deleteData(id) {
      await prisma.session.delete({
        where: {
          id,
        },
      });
    },
  });
}

export async function createUserSession({ request, userId, remember, redirectTo }: { request: Request; userId: string; remember: boolean; redirectTo: string }) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
