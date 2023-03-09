import {Player} from "@prisma/client";
import {getPlayerGreeting} from "~/utils";
import Subheading from "~/components/common/header/Subheading";
import React from "react";

const Greeting = ({
                      showGreeting,
                      player,
                  }: {
    showGreeting: boolean;
    player?: Player | null | undefined;
}) => {
    if (!showGreeting) return null;

    const greeting = `${(!!player && getPlayerGreeting(player.name)) || ""}`;
    return <Subheading title={greeting} className={'text-white'}/>;
};

export default Greeting
