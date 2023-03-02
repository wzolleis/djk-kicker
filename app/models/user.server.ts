import type {Password, User} from "@prisma/client";
import bcrypt from "bcryptjs";

import {prisma} from "~/db.server";

export type {User} from "@prisma/client";

export async function getUserById(id: User["id"]) {
    return prisma.user.findUnique({where: {id}});
}


export async function getUsers(): Promise<User[]> {
    return await prisma.user.findMany();
}


export async function getUserByEmail(email: User["email"]) {
    return prisma.user.findUnique({where: {email}});
}

export async function createUser(email: User["email"], password: string, name: string | undefined = undefined) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            email,
            name,
            password: {
                create: {
                    hash: hashedPassword,
                },
            },
        },
    });
}

export const changeUserPassword = async (userId: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    console.group('change password')
    console.info('hashed password', hashedPassword)
    console.info('userId', userId)

    return await prisma.password.update({
            where: {
                userId
            },
            data: {
                hash: hashedPassword
            }
        }
    )

}

export async function deleteUserById(userId: string) {
    return prisma.user.delete({where: {id: userId}});
}

export async function deleteUserByEmail(email: User["email"]) {
    return prisma.user.delete({where: {email}});
}


export const verifyPassword = async (userId: string, password: string) => {
    const userWithPassword = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            password: true,
        },
    });

    if (!userWithPassword || !userWithPassword.password) {
        return false;
    }

    return await bcrypt.compare(
        password,
        userWithPassword.password.hash
    );
}

export async function verifyLogin(
    email: User["email"],
    password: Password["hash"]
) {
    const userWithPassword = await prisma.user.findUnique({
        where: {email},
        include: {
            password: true,
        },
    });

    if (!userWithPassword || !userWithPassword.password) {
        return null;
    }

    const isValid = await bcrypt.compare(
        password,
        userWithPassword.password.hash
    );

    if (!isValid) {
        return null;
    }

    const {password: _password, ...userWithoutPassword} = userWithPassword;

    return userWithoutPassword;
}
