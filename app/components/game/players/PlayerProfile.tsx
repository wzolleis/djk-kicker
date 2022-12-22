import {json, LoaderFunction, redirect} from "@remix-run/node";
import {authenticatePlayer} from "~/utils/session.server";
import {Player} from "@prisma/client";
import {Form, useLoaderData} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import messages from "~/components/i18n/messages";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";

type LoaderData = {
    isAuthenticated: boolean;
    player: Player;
};

export const loader: LoaderFunction = async ({ params, request }) => {
    const { isAuthenticated, player } = await authenticatePlayer(params, request);
    if (!player) {
        return redirect("/application/games");
    }
    return json<LoaderData>({ isAuthenticated, player});
};

const EmailView = ({player}: {player: Player}) => {
    return (
        <div>
            <InputWithLabel id={'name'} type={'text'} name={'name'} defaultValue={player.name} label={messages.playerProfileForm.name}/>
            <InputWithLabel id={'mail'} type={'email'} name={'mail'} defaultValue={player.email} label={messages.playerProfileForm.email}/>
        </div>
    )
}

const PlayerProfile = () => {
    const { player } = useLoaderData() as unknown as LoaderData;
    return (
        <div>
            <Form>
               <EmailView player={player}/>
                <ButtonContainer>
                    <DefaultButton className={"m-5 flex justify-start flex-grow"}>
                        <button type="submit">{messages.buttons.save}</button>
                    </DefaultButton>
                </ButtonContainer>
            </Form>

        </div>
    )
}

export default PlayerProfile