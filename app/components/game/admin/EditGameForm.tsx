import InputWithLabel from "~/components/common/form/InputWithLabel";
import {Game} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {dateTimeToDateTimeLocalInputFormValue} from "~/utils";
import {DateTime} from "luxon";
import {Form} from "@remix-run/react";
import {ReactNode} from "react";
import ContentContainer from "~/components/common/container/ContentContainer";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import {config} from "~/components/i18n/config";

type EditGameFormProps = {
    game: Game,
    children: ReactNode;
}
const EditGameForm = ({game, children}: EditGameFormProps) => {

    return (
        <>
            <ContentContainer>
                <Form method={"post"} className={"flex flex-col gap-2"}>
                    <InputWithLabel id={"name"} type={"text"}
                                    name={"name"}
                                    label={messages.adminEditGameForm.name} defaultValue={game.name}/>
                    <InputWithLabel id={"gameTime"} type={"datetime-local"}
                                    name={"gameTime"} label={messages.adminEditGameForm.gameTime}
                                    defaultValue={dateTimeToDateTimeLocalInputFormValue(DateTime.fromJSDate(new Date(game.gameTime)))}/>
                    <SelectWithLabel id={"location"} name={"location"} defaultValue={config.gameLocations[config.gameLocations[game.spielort as unknown as number]]} label={messages.adminEditGameForm.spielort}>
                        {Object.keys(config.gameLocations).map((gameLocation) => (
                            <option value={config.gameLocations[gameLocation]} hidden={!isNaN(Number(gameLocation))} key={gameLocation}>{gameLocation}</option>
                        ) )}
                    </SelectWithLabel>
                    {children}
                </Form>
            </ContentContainer>
        </>
    )


}

export default EditGameForm;