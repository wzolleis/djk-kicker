import InputWithLabel from "~/components/common/form/InputWithLabel";
import {Game} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {DateTime} from "luxon";
import {Form} from "@remix-run/react";
import {PropsWithChildren} from "react";
import ContentContainer from "~/components/common/container/ContentContainer";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import {config} from "~/components/i18n/config";
import DateTimeInput from "~/components/common/datetime/datetime";


type EditGameFormProps = {
    game: Game,
}
const EditGameForm = ({game, children}: PropsWithChildren<EditGameFormProps>) => {
    return (
        <ContentContainer>
            <Form method={"post"} className={"flex flex-col gap-2"}>
                <InputWithLabel id={"name"}
                                type={"text"}
                                name={"name"}
                                label={messages.adminEditGameForm.name} defaultValue={game.name}
                />
                <DateTimeInput name='gameTime' defaultValue={DateTime.fromJSDate(new Date(game.gameTime))}/>
                <SelectWithLabel id={"location"}
                                 name={"location"}
                                 defaultValue={config.gameLocations[Number.parseInt(game.spielort)]}
                                 label={messages.adminEditGameForm.spielort}>
                    <option value={config.gameLocations.Halle}>{messages.adminEditGameForm.optionHalle}</option>
                    <option value={config.gameLocations.Draussen}>{messages.adminEditGameForm.optionDraussen}</option>
                </SelectWithLabel>
                {children}
            </Form>
        </ContentContainer>
    )
}

export default EditGameForm;