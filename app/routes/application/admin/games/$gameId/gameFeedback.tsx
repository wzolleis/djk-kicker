import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {getPlayersWithUniqueFeedbackForGame, PlayerWithFeedback} from "~/models/player.server";
import {useNextGame} from "~/utils/gameUtils";
import {Form, useLoaderData, useNavigate} from "@remix-run/react";
import ContentContainer from "~/components/common/container/ContentContainer";
import Subheading from "~/components/common/header/Subheading";
import {Player} from "@prisma/client";
import React, {useState} from "react";
import classNames from "classnames";
import {configuration} from "~/config";
import messages from "~/components/i18n/messages";
import {useDate} from "~/utils";
import TransitionContainer from "~/components/common/container/transitionContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import MainPageContent from "~/components/common/MainPageContent";
import SubmitButton from "~/components/common/buttons/submitButton";
import RedButton from "~/components/common/buttons/RedButton";
import invariant from "tiny-invariant";
import {FormWrapper} from "~/utils/formWrapper.server";
import {updateFeedback} from "~/models/feedback.server";
import routeLinks from "~/config/routeLinks";

type LoaderData = {
    players: PlayerWithFeedback[];
};

const PlayerFeedBackFormFieldValues = ["includedPlayers", "intent"] as const
export type PlayerFeedBackFormFields = typeof PlayerFeedBackFormFieldValues[number]

export const loader: LoaderFunction = async ({params}) => {

    const gameId = params.gameId
    if (!gameId) {
        return redirect("/application/admin/games")
    }

    const players: PlayerWithFeedback[] =
        await getPlayersWithUniqueFeedbackForGame(gameId);

    return json<LoaderData>({players})
}

export const action: ActionFunction = async ({request, params: {gameId}}) => {
    invariant(typeof gameId === 'string')
    const formData = await request.formData();

    const wrapper = new FormWrapper<PlayerFeedBackFormFields>(formData)
    const includedPlayerIdsString = wrapper.get('includedPlayers')
    const intent = wrapper.get("intent")
    invariant(typeof includedPlayerIdsString === 'string', 'included is not a string')
    const includedPlayerIds = includedPlayerIdsString.split(',')

    if (intent === 'save') {
        const playersWithFeedback = await getPlayersWithUniqueFeedbackForGame(gameId)
        for (let i = 0; i < playersWithFeedback.length; i++) {
            const player = playersWithFeedback[i]
            const isInConfirmedList = includedPlayerIds.some(id => id === player.id)
            if (isInConfirmedList) {
                await updateFeedback(player.id, gameId,
                    configuration.status.confirmed,
                    player.feedback.playerCount,
                    player.feedback.note
                )
            } else {
                await updateFeedback(player.id, gameId, configuration.status.declined,
                    player.feedback.playerCount,
                    player.feedback.note
                )
            }
        }
    }

    return redirect(routeLinks.admin.games)
}

type ActivePlayerButtonProps = {
    player: PlayerWithFeedback
    onPlayerClick: (player: PlayerWithFeedback) => void
    selected: boolean
}
const PlayerFeedBackView = ({player, onPlayerClick, selected}: ActivePlayerButtonProps) => {
    return (
        <div onClick={() => onPlayerClick(player)}>
            <div className={classNames({
                "bg-green-200": selected,
                "bg-red-400": !selected,
                "text-white": !selected,
                "text-gray-600": selected,
            }, "flex items-center justify-between border-b")}>
                <div className="p-3 text-lg font-bold">
                    {player.name}
                </div>
            </div>
        </div>
    )
}

const sortByName = (p1: Player, p2: Player) => p1.name.localeCompare(p2.name)
const GameFeedback = () => {
    const gameWithFeedBack = useNextGame();
    const navigate = useNavigate()
    const {players} = useLoaderData<LoaderData>() as unknown as LoaderData;
    const sorted = [...players].sort()
    const confirmed = sorted.filter((player) => player.feedback.status === configuration.status.confirmed)
    const declined = sorted.filter((player) => player.feedback.status !== configuration.status.confirmed)
    const [includedPlayers, setIncludedPlayers] = useState(confirmed)
    const [excludedPlayers, setExcludedPlayers] = useState<PlayerWithFeedback[]>(declined);

    const removePlayerFromArrayByPlayerId = (playerArray: Array<PlayerWithFeedback>, playerId: string): Array<PlayerWithFeedback> => {
        return playerArray.filter(p => p.id !== playerId).sort(sortByName)
    }

    const removePlayerFromIncludedList = (player: PlayerWithFeedback) => {
        setIncludedPlayers(removePlayerFromArrayByPlayerId(includedPlayers, player.id))
        setExcludedPlayers([...excludedPlayers, player].sort(sortByName))
    }

    const addPlayerToIncludedList = (player: PlayerWithFeedback) => {
        setExcludedPlayers(removePlayerFromArrayByPlayerId(excludedPlayers, player.id))
        setIncludedPlayers([...includedPlayers, player].sort(sortByName))
    }


    const isPlayerInIncludedList = (player: PlayerWithFeedback) => {
        return includedPlayers.some((value) => value.id === player.id)
    }

    const handlePlayerSelection = (player: PlayerWithFeedback) => {
        if (isPlayerInIncludedList(player)) {
            removePlayerFromIncludedList(player)
        } else {
            addPlayerToIncludedList(player)
        }
    }

    return (
        <div className={"min-h-screen"}>
            <TransitionContainer>
                <Form method={"post"}>
                    <input type={"hidden"} value={includedPlayers.map(p => p.id)} name={"includedPlayers"}/>
                    <MainPageContent>
                        <Subheading title={messages.adminEditFeedbackForm.title(useDate(new Date(gameWithFeedBack.gameTime)))}/>
                        <ContentContainer className={"mt-3"}>
                            <main className={"mt-5 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}>
                                {
                                    players.map((player: PlayerWithFeedback) => {
                                            const selected = isPlayerInIncludedList(player)
                                            return (
                                                <PlayerFeedBackView key={player.id}
                                                                    player={player}
                                                                    onPlayerClick={handlePlayerSelection}
                                                                    selected={selected}
                                                />
                                            )
                                        }
                                    )
                                }
                            </main>
                        </ContentContainer>
                    </MainPageContent>
                    <ButtonContainer>
                        <RedButton className={'mr-auto'}>
                            <img className={"h-6"} src={"/img/icons/close-white.png"} alt={""}/>
                            <button type={"button"} onClick={() => navigate(-1)}>{messages.buttons.cancel}</button>
                        </RedButton>
                        <DefaultButton>
                            <img className={"h-6"} src="/img/icons/check.png" alt=""/>
                            <SubmitButton label={messages.buttons.save} showTransitionSpinner={true} name={'intent'} value={'save'}/>
                        </DefaultButton>
                    </ButtonContainer>
                </Form>
            </TransitionContainer>

        </div>
    )

}

export default GameFeedback