import type {Player} from "@prisma/client";
import {Link} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import RedButton from "~/components/common/buttons/RedButton";

export type AdminTableRowProps = {
    player: Player;
};

const AdminTableRow = ({player}: AdminTableRowProps) => {
    return (
        <>
            <td className={"py-5 "}>{player.name}</td>
            <td className={"text-indigo-500 underline"}>
                <a href={`mailto:${player.email}`}>{player.email}</a>
            </td>
            <td className={"text-right"}>
                <ButtonContainer>
                    <DefaultButton className={'ml-auto'}>
                        <Link to={`edit/?player=${player.id}`}>{messages.buttons.edit}</Link>
                    </DefaultButton>
                    <RedButton className={'bg-red-600'}>
                        <Link to={`delete/?player=${player.id}`}>{messages.buttons.delete}</Link>
                    </RedButton>
                </ButtonContainer>
            </td>
        </>
    );
};

export default AdminTableRow;
