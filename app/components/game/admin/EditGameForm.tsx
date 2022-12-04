import InputWithLabel from "~/components/common/form/InputWithLabel";
import {Game} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {DateTime} from "luxon";
import {Form} from "@remix-run/react";
import {PropsWithChildren} from "react";
import ContentContainer from "~/components/common/container/ContentContainer";
import SelectWithLabel from "~/components/common/form/SelectWithLabel";
import DateTimeInput from "~/components/common/datetime/datetime";
import {configuration} from "~/config";


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
                                 defaultValue={configuration.gameLocations[Number.parseInt(game.spielort)]}
                                 label={messages.adminEditGameForm.spielort}>
                    <option value={configuration.gameLocations.Halle}>{messages.adminEditGameForm.optionHalle}</option>
                    <option value={configuration.gameLocations.Draussen}>{messages.adminEditGameForm.optionDraussen}</option>
                </SelectWithLabel>
                {children}
            </Form>
        </ContentContainer>
    )
}

export default EditGameForm;