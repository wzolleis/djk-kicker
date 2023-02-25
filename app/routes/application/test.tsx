import { useLoaderData } from "@remix-run/react";
import ErrorComponent from "~/components/common/error/ErrorComponent";

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
