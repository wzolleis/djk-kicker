import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getGameById, getGames } from "~/models/game.server";
import type { Game } from "@prisma/client";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";
import gameHeader from "~/components/game/gameHeader";
import GameHeader from "~/components/game/gameHeader";
import Players from "~/components/game/Players";
import { Prisma } from "@prisma/client";




export default function Games() {


  // @ts-ignore
  return (
    <div className="px-3 flex flex-col gap-5">
     <Outlet></Outlet>
    </div>
  );

}