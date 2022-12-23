import { Player } from "@prisma/client";
import PageHeader from "~/components/common/PageHeader";
import messages from "~/components/i18n/messages";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import React from "react";
import { Form } from "@remix-run/react";

type ConfirmPlayerChangeProps = {
    player: Player;
    newPlayer: Player;
};

const ConfirmPlayerChange = ({
    player,
    newPlayer,
}: ConfirmPlayerChangeProps) => {
    return (
        <>
            <p className={"font-default-regular text-body-large text-red-800"}>
                {messages.player.confirmChange}
            </p>
            <div className={"mt-5 flex flex-col gap-3"}>
                <Form method={"post"}>
                    <DefaultButton>
                        <button name={"intent"} value={"confirm"}>
                            {messages.player.confirmChangeButton(
                                newPlayer.name
                            )}
                        </button>
                    </DefaultButton>
                </Form>
                <Form method={"post"}>
                    <DefaultButton fill={false}>
                        <button name={"intent"} value={"decline"}>
                            {messages.player.declineChangeButton(player.name)}
                        </button>
                    </DefaultButton>
                </Form>
            </div>
        </>
    );
};

export default ConfirmPlayerChange;
