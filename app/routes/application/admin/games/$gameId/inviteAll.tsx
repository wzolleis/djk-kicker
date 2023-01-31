import {useDateTime, usePlayers} from "~/utils";
import React, {useState} from "react";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {Player} from "@prisma/client";
import {Form} from "@remix-run/react";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {ActionFunction, json} from "@remix-run/node";
import {FormWrapper} from "~/utils/formWrapper.server";
import {MailBuilder} from "~/helpers/mail/mailApiClient";
import invariant from "tiny-invariant";
import {getPlayerDataForMail} from "~/models/player.server";
import {createEncryptedPlayerToken} from "~/utils/token.server";
import mailLinkBuilder from "~/helpers/mail/mailLinkBuilder";
import {findGameById} from "~/models/games.server";
import messages from "~/components/i18n/messages";
import axios from "axios";

const sortByName = (p1: Player, p2: Player) => p1.name.localeCompare(p2.name)

const removePlayerFromArrayByPlayerId = (playerArray: Array<Player>, playerId: string): Array<Player> => {
    return playerArray.filter(p => p.id !== playerId).sort(sortByName)
}

const GameInvitationFormValues = ["includedPlayers"] as const
export type GameInvitationFormFields = typeof GameInvitationFormValues[number]

export const action: ActionFunction = async ({request, params: {gameId}}) => {
    invariant(typeof gameId === 'string')
    const formData = await request.formData();

    const wrapper = new FormWrapper<GameInvitationFormFields>(formData)
    const includedPlayerIdsString = wrapper.get('includedPlayers')

    const game = await findGameById(gameId)
    invariant(!!game, "game not found")
    const mailApiClient = new MailBuilder({
        gameDate: useDateTime(game.gameTime),
        gameLocation: messages.commonForm.spielort(game.spielort),
        templateName: 'Invitation'
    })

    invariant(typeof includedPlayerIdsString === 'string', 'included is not a string')
    const includedPlayerIds = includedPlayerIdsString.split(',')
    const playerMailData = await getPlayerDataForMail(includedPlayerIds)
    const host = request.headers.get("host")!;

    for (let i = 0; i < playerMailData.length; i++) {
        const data = playerMailData[i]
        const token = await createEncryptedPlayerToken(data.id, gameId);
        const invitationLink = mailLinkBuilder.gameInvitationLink({host, gameId, token})
        mailApiClient.addInvitation({
            invitationLink,
            playerName: data.name,
            mailAddress: data.email
        })
    }

    const instance = axios.create({
        baseURL: process.env.MAILSERVICE_ENDPOINT,
        timeout: 60000,
        headers: {
            'X-API-KEY': process.env.MAILSERVICE_API_KEY,
            'Content-Type': 'application/json'
        }
    });

    const invitationMail = mailApiClient.buildInvitationMail()
    console.log('>>> mail data = ', JSON.stringify(invitationMail, undefined, 2))
    const response = await instance.post('/send', invitationMail)
    console.log('mail sending response', response.data)
    return json({})
}

const GameInvitation = () => {
    const allPlayers = usePlayers()
    const sorted = [...allPlayers].sort()
    const [includedPlayers, setIncludedPlayers] = useState(sorted)
    const [excludedPlayers, setExcludedPlayers] = useState(Array<Player>);

    const removePlayerFromIncludedList = (player: Player) => {
        setIncludedPlayers(removePlayerFromArrayByPlayerId(includedPlayers, player.id))
        setExcludedPlayers([...excludedPlayers, player].sort(sortByName))
    }
    const addPlayerToIncludedList = (player: Player) => {
        setExcludedPlayers(removePlayerFromArrayByPlayerId(excludedPlayers, player.id))
        setIncludedPlayers([...includedPlayers, player].sort(sortByName))
    }

    const addAllToIncluded = () => {
        setIncludedPlayers([...allPlayers].sort(sortByName))
        setExcludedPlayers([])
    }

    const removeAllFromIncluded = () => {
        setIncludedPlayers([])
        setExcludedPlayers([...allPlayers].sort(sortByName))
    }

    return (
        <Form method={"post"} replace={true}>
            <input type={"hidden"} value={includedPlayers.map(p => p.id)} name={"includedPlayers"}/>
            <div className="flex flex-col grid-cols-2 md:flex-row justify-start gap-5 mt-5 h-fit mb-10">
                <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900 overflow-auto h-80 md:min-h-80 bg-green-100">
                    {
                        includedPlayers.map((player) => {
                            return (
                                <li className="px-6 py-2 border-b border-white w-full rounded-t-lg"
                                    onClick={() => removePlayerFromIncludedList(player)}
                                    key={player.id}
                                >
                                    {player.name}
                                </li>
                            )
                        })
                    }
                </ul>
                <ul className="bg-white rounded-lg border border-gray-200 w-96 text-gray-900 overflow-y-scroll h-80 md:min-h-80 bg-red-100">
                    {
                        excludedPlayers.map((player) => {
                            return (
                                <li className="px-6 py-2 border-b border-white  w-full rounded-t-lg"
                                    key={player.id}
                                    onClick={() => addPlayerToIncludedList(player)}
                                >
                                    {player.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <ButtonContainer>
                <DefaultButton className={"bg-green-700"}>
                    <button type={"submit"}>Einladungen schicken</button>
                </DefaultButton>
                <DefaultButton className={"bg-gray-600"}>
                    <button type='button' onClick={addAllToIncluded}>{'alle hinzufügen'}</button>
                </DefaultButton>
                <DefaultButton className={"bg-gray-600 mr-auto"}>
                    <button type='button' onClick={removeAllFromIncluded}>{'alle entfernen'}</button>
                </DefaultButton>
            </ButtonContainer>
        </Form>
    )
}

export default GameInvitation