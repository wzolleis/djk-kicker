import {Form, useNavigate} from "@remix-run/react";
import {createGame} from "~/models/admin.games.server";
import messages from "~/components/i18n/messages";
import type {ActionFunction} from "@remix-run/node";
import {redirect} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import invariant from "tiny-invariant";
import dateUtils from "~/dateUtils";
import routeLinks from "~/config/routeLinks";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import DateTimeInput from "~/components/common/datetime/datetime";
import {getNextGameDay} from "~/utils";
import RedButton from "~/components/common/buttons/RedButton";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import SubmitButton from "~/components/common/buttons/submitButton";
import ContentContainer from "~/components/common/container/ContentContainer";
import LocationInput from "~/components/common/location/location";
import {configuration} from "~/config";

export const action: ActionFunction = async ({request}) => {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const name = formData.get("name");
    const location = formData.get("location");
    const gameTimeTxt = formData.get("gameTime")?.toString() || "";
    const gameTime = dateUtils.dateTimeFromFormat({text: gameTimeTxt});

    invariant(typeof userId === "string", "UserId must be a string");
    invariant(typeof name === "string", "name must be a string");
    await createGame(gameTime, name, location!.toString());
    return redirect(routeLinks.admin.adminLandingPage);
};

const NewGame = () => {
    const navigate = useNavigate()
    return (
        <ContentContainer className={"bg-blue-200 mt-5"}>
            <Form method={"post"} className={"flex flex-col gap-3"}>
                <InputWithLabel type={"text"} id={"name"} name={"name"} label={"Spielname"}/>
                <DateTimeInput name={"gameTime"} defaultValue={getNextGameDay()}/>
                <LocationInput name={'location'} defaultValue={configuration.gameLocations.Unbekannt}/>
                <div className={"flex gap-3 items-center w-full justify-end"}>
                    <RedButton className={'mr-auto'}>
                        <img className={"h-6"} src={"/img/icons/close-white.png"} alt={""}/>
                        <button type={"button"} onClick={() => navigate(-1)}>{messages.buttons.cancel}</button>
                    </RedButton>
                    <DefaultButton>
                        <img className={"h-6"} src="/img/icons/check.png" alt=""/>
                        <SubmitButton label={messages.buttons.save} showTransitionSpinner={true}/>
                    </DefaultButton>
                </div>
            </Form>
        </ContentContainer>
    );
};
export default NewGame;
