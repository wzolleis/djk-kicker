import type {Player} from "@prisma/client";
import {Link} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import routeLinks from "~/helpers/constants/routeLinks";

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
                <ButtonContainer className={"flex justify-end"}>
                    <RedButton>
                        <p className={"fa fa-trash mr-2"}/>
                        <Link to={routeLinks.player.delete(player.id)}>{messages.buttons.delete}</Link>
                    </RedButton>
                </ButtonContainer>
            </td>
        </>
    );
};

export default AdminTableRow;
