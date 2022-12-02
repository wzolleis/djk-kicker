import InputWithLabel from "~/components/common/form/InputWithLabel";
import {Game} from "@prisma/client";
import messages from "~/components/i18n/messages";
import {dateTimeToDateTimeLocalInputFormValue} from "~/utils";
import {DateTime} from "luxon";
import {Form} from "@remix-run/react";
import {ReactNode} from "react";

type EditGameFormProps = {
    game: Game,
    children: ReactNode;
}
const EditGameForm = ({game, children}: EditGameFormProps) => {

    return (
        <>
            <Form method={"post"} className={"flex flex-col gap-2"}>
                <InputWithLabel id={"name"} type={"text"}
                                name={"name"}
                                label={messages.adminEditGameForm.name} defaultValue={game.name}/>
                <InputWithLabel id={"gameTime"} type={"datetime-local"}
                                name={"gameTime"} label={messages.adminEditGameForm.gameTime}
                                defaultValue={dateTimeToDateTimeLocalInputFormValue(DateTime.fromJSDate(new Date(game.gameTime)))}/>


                    {children}
            </Form>
        </>
    )


}

export default EditGameForm;