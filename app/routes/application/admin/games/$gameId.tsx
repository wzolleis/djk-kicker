import {useEffect, useState} from "react";
import Modal from "~/components/common/modal/Modal";
import messages from "~/components/i18n/messages";
import type {Game} from "@prisma/client";
import type {ActionFunction, LoaderFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {Outlet, useLoaderData, useNavigate} from "@remix-run/react";
import invariant from "tiny-invariant";

import {GameFromForm, getGameFromFormData} from "~/utils/game.server";
import routeLinks from "~/helpers/constants/routeLinks";
import {dateTimeLocalInputValueToDateTime} from "~/utils";
import {deleteGame, findGameById, updateGame} from "~/models/admin.games.server";
import {requireUserId} from "~/session.server";
import TabContainer from "~/components/common/tabs/TabContainer";
import Tab from "~/components/common/tabs/Tab";
import {config} from "~/components/i18n/config";



export const loader: LoaderFunction = async ({params, request}) => {
    if(!Object.keys(config.url.editGameForm.values).includes(request.url.split("/").pop()!)){
        return redirect("/application/admin/games")
    }
    return json({hello: "hello"})
}


const EditGame = () => {

    const [showModal, setShowModal] = useState(true);
    const navigate = useNavigate();

    const toggleModal = (e: MouseEvent) => {
        return navigate("/application/admin/games")
    }
    const [currentUrl, setCurrentUrl] = useState('')
    useEffect(() => {
        const lastUrlElement: string = (window.location.pathname.split("/").pop()!)
        setCurrentUrl(lastUrlElement)
    },)

    const handleNavigate = (url: string) => {
        navigate(`${window.location.pathname}/${url}`)
    }
    return (
        <>
            <Modal title={messages.adminEditGameForm.title} show={showModal}
                   onClose={(e: MouseEvent) => toggleModal(e)}>
                <div className={"flex flex-col gap-3"}>
                    <TabContainer>
                        <Tab url={'edit'} title={config.url.editGameForm.translations.edit}
                             isActive={currentUrl === config.url.editGameForm.values.edit}>
                            <img className={"h-6"} src="/img/icons/pencil-line.png" alt=""/>
                        </Tab>
                        <Tab url={'status'} title={config.url.editGameForm.translations.status}
                             isActive={currentUrl === config.url.editGameForm.values.status}>
                            <img className={"h-6"} src="/img/icons/status.png" alt=""/>
                        </Tab>
                        <Tab url={'invite'} title={config.url.editGameForm.translations.invite}
                             isActive={currentUrl == config.url.editGameForm.values.invite}>
                            <img className={"h-6"} src="/img/icons/mail.png" alt=""/>
                        </Tab>
                    </TabContainer>
                    <Outlet></Outlet>
                </div>
            </Modal>
        </>
    )
}


export default EditGame;