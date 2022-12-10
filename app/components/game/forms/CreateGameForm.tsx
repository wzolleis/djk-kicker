import {Form, useNavigate} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import messages from "~/components/i18n/messages";
import DateTimeInput from "~/components/common/datetime/datetime";
import {getNextGameDay} from "~/utils";
import {gameLocations} from "~/config/locations";
import {configuration} from "~/config";
import RedButton from "~/components/common/buttons/RedButton";

const CreateGameForm = () => {
    const navigate = useNavigate();
    return (
        <Form method={"post"} className={"flex flex-col gap-3"}>
            <InputWithLabel type={"text"} id={"name"} name={"name"} label={"Spielname"}/>
            <DateTimeInput name={"gameTime"} defaultValue={getNextGameDay()}/>
            <SelectWithLabel id={"location"} name={"location"} defaultValue={gameLocations.Draussen.toString()}
                             label={messages.adminEditGameForm.spielort}>
                {Object.keys(configuration.gameLocations).map((gameLocation) => (
                    <option value={configuration.gameLocations[gameLocation as unknown as number]} hidden={!isNaN(Number(gameLocation))}
                            key={gameLocation}>{gameLocation}</option>
                ))}
            </SelectWithLabel>
            <div className={"flex gap-3 items-center w-full justify-end"}>
                <RedButton className={'mr-auto'}>
                    <img className={"h-6"} src={"/img/icons/close-white.png"} alt={""} />
                    <button type={"button"} onClick={() => navigate(-1)}>{messages.buttons.cancel}</button>
                </RedButton>
                <DefaultButton>
                    <img className={"h-6"} src="/img/icons/check.png" alt=""/>
                    <button type={"submit"}>{messages.buttons.save}</button>
                </DefaultButton>
            </div>
        </Form>


    )


}


export default CreateGameForm