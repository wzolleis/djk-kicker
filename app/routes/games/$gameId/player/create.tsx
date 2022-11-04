import PlayerForm from "~/components/player/PlayerForm";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export const loader = async ({ params }: { params: any }) => {
  const test = params.gameId;

  return json({ test });

};


const CreatePlayer = () => {
  const { test } = useLoaderData();
  return (
    <div>
      <PlayerForm gameId={test} />
    </div>
  );


};

export default CreatePlayer;