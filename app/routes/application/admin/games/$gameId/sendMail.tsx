import {usePlayers} from "~/utils";
import React, {useState} from "react";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {Player} from "@prisma/client";
import {Form} from "@remix-run/react";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {ActionFunction, json} from "@remix-run/node";
import {FormWrapper} from "~/utils/formWrapper.server";
import invariant from "tiny-invariant";
import messages from "~/components/i18n/messages";
import MainPageContent from "~/components/common/MainPageContent";
import classNames from "classnames";
import {isMailTemplate, MailTemplateType} from "~/config/mailTypes";
import ContentContainer from "~/components/common/container/ContentContainer";
import TransitionContainer from "~/components/common/container/transitionContainer";
import {MailService} from "~/helpers/mail/mailService";
import TextAreaWithLabel from "~/components/common/form/TextareaWithLabel";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import {updateGameStatus} from "~/models/admin.games.server";
import {useItemSelectionList} from "~/components/selection";

// const sortByName = (p1: Player, p2: Player) => p1.name.localeCompare(p2.name)

const SendMailFormFieldValues = ["includedPlayers", "mailTemplate", 'mailSubject', "freeText"] as const
export type SendMailFormFields = typeof SendMailFormFieldValues[number]

export const action: ActionFunction = async ({request, params: {gameId}}) => {
    invariant(typeof gameId === 'string')
    const formData = await request.formData();
    const host = request.headers.get("host")!;

    const wrapper = new FormWrapper<SendMailFormFields>(formData)
    const includedPlayerIdsString = wrapper.get('includedPlayers')
    const mailTemplate = wrapper.get("mailTemplate")
    invariant(isMailTemplate(mailTemplate), "invalid template name " + mailTemplate)
    invariant(typeof includedPlayerIdsString === 'string', 'included is not a string')
    const includedPlayerIds = includedPlayerIdsString.split(',')
    const freeText = wrapper.get('freeText')
    invariant(typeof freeText === 'string', 'freeText is not a string')
    const mailSubject = wrapper.get('mailSubject')
    invariant(typeof mailSubject === 'string', 'mailSubject is not a string')

    const mailService = new MailService(gameId, mailTemplate, includedPlayerIds, freeText, mailSubject, host)
    await mailService.sendGameMail()

    if (isMailTemplate(mailTemplate)) {
        if (mailTemplate === 'gameZusage') {
            await updateGameStatus(gameId, 'Zusage')
        } else if (mailTemplate === 'gameAbsage') {
            await updateGameStatus(gameId, 'Absage')
        } else if (mailTemplate === 'gameInvitation') {
            await updateGameStatus(gameId, 'Einladung')
        }
    }

    return json<{}>({})
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

                    <MailTemplateView
                        onSelect={() => onSelect("freeText")}
                        selected={isSelected("freeText")}
                        mailTemplate={"freeText"}
                        label={"Freier Text"}/>

                    <MailTemplateView onSelect={() => onSelect("testMail")}
                                      selected={isSelected("testMail")}
                                      mailTemplate={"testMail"}
                                      label={"TestMail"}/>

                </div>
            </div>
        </div>
    )
}

const FreeTextInput = () => {
    return (
        <>
            <InputWithLabel id={'mailSubject'}
                            type={'text'}
                            name={'mailSubject'}
                            label={messages.adminSendMailForm.mailSubjectLabel}
                            defaultValue={'Nachricht von den DJK-Kickern'}
                            disabled={false}
                            required={false}
            />
            <TextAreaWithLabel label={messages.adminSendMailForm.freeText}
                               required={false}
                               name={'freeText'}
                               id={'freeText'}
                               disabled={false}
                               defaultValue={'Jeder darf einen Grashalm mitnehmen'}/>
        </>
    )
}

type ActivePlayerButtonProps = {
    player: Player
    onPlayerClick: (player: Player) => void

    selected: boolean
}
const ActivePlayerButton = ({player, onPlayerClick, selected}: ActivePlayerButtonProps) => {
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

const SendGameMail = () => {
    const allPlayers = usePlayers()
    const selection = useItemSelectionList({items: allPlayers})
    const [mailTemplate, setMailTemplate] = useState<MailTemplateType>("gameInvitation")
    const freeTextDisplay = mailTemplate !== 'freeText' ? 'hidden' : 'block'

    return (
        <div className={"min-h-screen"}>
            <TransitionContainer>
                <Form method={"post"}>
                    <input type={"hidden"} value={selection.includedItems.map(p => p.id)} name={"includedPlayers"}/>
                    <input type={"hidden"} value={mailTemplate} name="mailTemplate"/>
                    <MainPageContent>
                        <header className={"flex items-center justify-between"}>
                            <p className={"font-default-medium text-headline-small text-darkblue"}>{"Mail verschicken"}</p>
                        </header>

                        <ContentContainer>
                            <MailTemplateSelect selected={mailTemplate} onSelect={(mailTemplate: MailTemplateType) => setMailTemplate(mailTemplate)}/>
                        </ContentContainer>
                        <ContentContainer className={classNames(freeTextDisplay, 'mt-2 bg-blue-200')}>
                            <FreeTextInput/>
                        </ContentContainer>

                        <ContentContainer className={"mt-3 bg-blue-200"}>
                            <header className={"flex items-center justify-between"}>
                                <p className={"font-default-medium text-headline-small text-darkblue"}>{messages.adminSendMailForm.selectRecipient}</p>
                            </header>

                            <ButtonContainer>
                                <DefaultButton className={"bg-green-400"}>
                                    <button type='button'
                                            onClick={selection.addAllItemsToIncluded}>{messages.adminSendMailForm.addAllRecipients}</button>
                                </DefaultButton>
                                <DefaultButton className={"bg-red-400"}>
                                    <button type='button'
                                            onClick={selection.removeAllItemsFromIncluded}>{messages.adminSendMailForm.removeAllRecipients}</button>
                                </DefaultButton>
                            </ButtonContainer>

                            <main className={"mt-5 flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"}>
                                {
                                    allPlayers.map((player: Player) => {
                                        const selected = selection.isItemIncluded(player)
                                            return (
                                                <ActivePlayerButton key={player.id} player={player} onPlayerClick={selection.handleItemSelection}
                                                                    selected={selected}/>
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