import ErrorComponent from "~/components/common/error/ErrorComponent";
import { json, LoaderFunction } from "@remix-run/node";
import { createDatabaseSessionStorage } from "~/session.server";
import { useLoaderData } from "@remix-run/react";

const Test = () => {
  const { username, sessionId, userId } = useLoaderData();

  return (
    <>
      <p>Username: {username}</p>
      <p>UserId: {userId}</p>
      <p>SessionId: {sessionId}</p>
      <ErrorComponent></ErrorComponent>
    </>
  );
};

export default Test;
