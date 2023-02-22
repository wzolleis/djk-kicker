import {usePlayers} from "~/utils";
import React, {useState} from "react";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {Player} from "@prisma/client";
import {Form} from "@remix-run/react";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {ActionFunction, json} from "@remix-run/node";
import {FormWrapper} from "~/utils/formWrapper.server";
import invariant from "tiny-invariant";
import {getPlayerDataForMail} from "~/models/player.server";
import {findGameById} from "~/models/games.server";
import messages from "~/components/i18n/messages";
import MainPageContent from "~/components/common/MainPageContent";
import classNames from "classnames";
import {isMailTemplate, MailTemplateType} from "~/config/mailTypes";
import ContentContainer from "~/components/common/container/ContentContainer";
import {createMailData, GameMailStatusResponse, getGameMailStatus, sendGameMail} from "~/helpers/mail/mailServiceHelper";
import {createMailServiceRequest} from "~/models/mailservice.server";
import TransitionContainer from "~/components/common/container/transitionContainer";

const sortByName = (p1: Player, p2: Player) => p1.name.localeCompare(p2.name)

const removePlayerFromArrayByPlayerId = (playerArray: Array<Player>, playerId: string): Array<Player> => {
    return playerArray.filter(p => p.id !== playerId).sort(sortByName)
}

const SendMailFormFieldValues = ["includedPlayers", "mailTemplate"] as const
export type SendMailFormFields = typeof SendMailFormFieldValues[number]

export const action: ActionFunction = async ({request, params: {gameId}}) => {
    invariant(typeof gameId === 'string')
    const formData = await request.formData();

    const wrapper = new FormWrapper<SendMailFormFields>(formData)
    const includedPlayerIdsString = wrapper.get('includedPlayers')

    const game = await findGameById(gameId)
    invariant(!!game, "game not found")
    const mailTemplate = wrapper.get("mailTemplate")
    invariant(isMailTemplate(mailTemplate), "invalid template name " + mailTemplate)
    invariant(typeof includedPlayerIdsString === 'string', 'included is not a string')
    const includedPlayerIds = includedPlayerIdsString.split(',')
    const playerMailData = await getPlayerDataForMail(includedPlayerIds)
    const host = request.headers.get("host")!;

    const mail = await createMailData({
        game,
        mailTemplate,
        playerMailData,
        host
    })

    const requestId = await sendGameMail({mail})
    await createMailServiceRequest({requestId, gameId, requestType: mail.mail.template, requestPayload: JSON.stringify(mail)})
    const statusResponse = await getGameMailStatus(requestId)
    return json<GameMailStatusResponse>(statusResponse)
}

type MailTemplateViewProps = {
    onSelect: (template: MailTemplateType) => void
    selected: boolean
    mailTemplate: MailTemplateType
    label: string
}
const MailTemplateView = ({onSelect, selected, label, mailTemplate}: MailTemplateViewProps) => {
    const iconStyle = {
        "fa-circle-check": selected,
        "fa-circle": !selected,
    }

    const selectionStyle = {
        "bg-blue-900": selected,
        "bg-blue-500": !selected,
    }

    return (
        <div onClick={() => onSelect(mailTemplate)}
             className={classNames(selectionStyle, "flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border cursor-pointer rounded-xl md:hover:bg-blue-900")}
        >
            <div className="flex items-center">
                <i className={classNames(iconStyle, "fa-solid text-2xl text-white")}/>
                <div className="flex flex-col items-center mx-5 space-y-1">
                    <h2 className={"text-white text-lg font-medium sm:text-2xl"}>{label}</h2>
                </div>
            </div>
        </div>
    )
}


type SelectMailTemplateProps = {
    selected: MailTemplateType
    onSelect: (template: MailTemplateType) => void
}
const MailTemplateSelect = ({selected, onSelect}: SelectMailTemplateProps) => {
    const isSelected = (template: MailTemplateType): boolean => template === selected

    return (
        <div className="bg-blue-200">
            <div className="container px-6 py-4 md:py-8 mx-auto">
                <div className="mt-1 md:mt-6 space-y-4 md:space-y-8 xl:mt-12">
                    <MailTemplateView onSelect={() => onSelect("gameInvitation")}
                                      selected={isSelected("gameInvitation")}
                                      mailTemplate={"gameInvitation"}
                                      label={messages.adminSendMailForm.invitation}/>

                    <MailTemplateView onSelect={() => onSelect("gameZusage")}
                                      selected={isSelected("gameZusage")}
                                      mailTemplate={"gameZusage"}
                                      label={messages.adminSendMailForm.confirmation}/>

                    <MailTemplateView onSelect={() => onSelect("gameAbsage")}
                                      selected={isSelected("gameAbsage")}
                                      mailTemplate={"gameAbsage"}
                                      label={messages.adminSendMailForm.cancellation}/>

                    <div className={"hidden md:block md:mt-12"}>
                        <MailTemplateView onSelect={() => onSelect("testMail")}
                                          selected={isSelected("testMail")}
                                          mailTemplate={"testMail"}
                                          label={"TestMail"}/>
                    </div>

                </div>
            </div>
        </div>
    )
}

const SendGameMail = () => {
    const allPlayers = usePlayers()
    const sorted = [...allPlayers].sort()
    const [includedPlayers, setIncludedPlayers] = useState(sorted)
    const [excludedPlayers, setExcludedPlayers] = useState(Array<Player>);
    const [mailTemplate, setMailTemplate] = useState<MailTemplateType>("gameInvitation")

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

    const isPlayerInIncludedList = (player: Player) => {
        return includedPlayers.some((value) => value.id === player.id)
    }

    const handlePlayerSelection = (player: Player) => {
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
                    <input type={"hidden"} value={mailTemplate} name="mailTemplate"/>
                    <MainPageContent>
                        <header className={"flex items-center justify-between"}>
                            <p className={"font-default-medium text-headline-small text-darkblue"}>{"Mail verschicken"}</p>
                        </header>

                        <ContentContainer>
                            <MailTemplateSelect selected={mailTemplate} onSelect={(mailTemplate: MailTemplateType) => setMailTemplate(mailTemplate)}/>
                        </ContentContainer>

                        <ContentContainer className={"mt-3 bg-blue-200"}>
                            <header className={"flex items-center justify-between"}>
                                <p className={"font-default-medium text-headline-small text-darkblue"}>{messages.adminSendMailForm.selectRecipient}</p>
                            </header>

                            <ButtonContainer>
                                <DefaultButton className={"bg-green-400"}>
                                    <button type='button' onClick={addAllToIncluded}>{messages.adminSendMailForm.addAllRecipients}</button>
                                </DefaultButton>
                                <DefaultButton className={"bg-red-400"}>
                                    <button type='button' onClick={removeAllFromIncluded}>{messages.adminSendMailForm.removeAllRecipients}</button>
                                </DefaultButton>
                            </ButtonContainer>

                            <main className={"mt-5 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}>
                                {
                                    allPlayers.map((player: Player) => {
                                            const selected = isPlayerInIncludedList(player)
                                            return (
                                                <div key={player.id} onClick={() => handlePlayerSelection(player)}>
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
                                    )
                                }
                            </main>
                        </ContentContainer>
                    </MainPageContent>
                    <ButtonContainer>
                        <DefaultButton className={"ml-auto"}>
                            <button type={"submit"}>
                                <i className={"fa-solid fa-envelopes-bulk mr-2"}/>
                                {messages.adminSendMailForm.sendMails}
                            </button>
                        </DefaultButton>
                    </ButtonContainer>
                </Form>
            </TransitionContainer>
        </div>
    )
}

export default SendGameMail