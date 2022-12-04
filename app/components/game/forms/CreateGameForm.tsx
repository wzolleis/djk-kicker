import {Form, useNavigate} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import messages from "~/components/i18n/messages";
import DeleteButton from "~/components/common/buttons/status/DeleteButton";
import DateTimeInput from "~/components/common/datetime/datetime";
import {getNextGameDay} from "~/utils";
import {gameLocations} from "~/config/locations";
import {configuration} from "~/config";

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
                <DeleteButton>
                    <img className={"h-6"} src={"/img/icons/close-white.png"} alt={""} />
                    <button type={"button"} onClick={() => navigate(-1)}>Abbrechen</button>
                </DeleteButton>
                <DefaultButton>
                    <img className={"h-6"} src="/img/icons/check.png" alt=""/>
                    <button type={"submit"}>Speichern</button>
                </DefaultButton>
            </div>
        </Form>


    )


}


export default CreateGameForm