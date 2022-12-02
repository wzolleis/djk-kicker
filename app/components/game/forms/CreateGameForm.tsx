import {Form, useNavigate} from "@remix-run/react";
import InputWithLabel from "~/components/common/form/InputWithLabel";
import DefaultButton from "~/components/common/buttons/DefaultButton";

const CreateGameForm = () => {

    const navigate = useNavigate();

    return (
        <Form className={"flex flex-col gap-3"}>
            <InputWithLabel type={"text"} id={"name"} name={"name"} label={"Spielname"} />
            <InputWithLabel type={"date"} id={"name"} name={"name"} label={"Spieldatum"}/>
            <InputWithLabel type={"text"} id={"name"} name={"name"} label={"Ort"}/>
            <div className={"flex gap-3 items-center w-full justify-end"}>
                <DefaultButton>
                    <button type={"button"} onClick={() => navigate(-1)}>Abbrechen</button>
                </DefaultButton>
                <DefaultButton>
                    <button type={"submit"}>Speichern</button>
                </DefaultButton>
            </div>
        </Form>


    )


}


export default CreateGameForm