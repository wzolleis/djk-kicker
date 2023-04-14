import type {Player} from "@prisma/client";
import {Link} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import routeLinks from "~/config/routeLinks";
import Button from "~/components/common/buttons/Button";

export type AdminTableRowProps = {
    player: Player;
};

const AdminTableRow = ({player}: AdminTableRowProps) => {
    return (
        <>
            <td className={"py-5"}>{player.name}</td>
            <td className={"text-indigo-500 underline"}>
                <a href={`mailto:${player.email}`}>{player.email}</a>
            </td>
            <td>{messages.adminOverviewTable.activeStatus(player.isActive ?? false)} </td>
            <td className={"hidden md:flex"}>{player.id}</td>
            <td className={"text-center"}>
                <ButtonContainer className={'flex justify-between'}>
                    {
                        !player.isActive &&
                        <Button className={'bg-green-500'}>
                            <p className={"fa-solid fa-thumbs-up"}/>
                            <Link to={routeLinks.admin.players.status(player.id)}>{messages.buttons.activate}</Link>
                        </Button>
                    }
                    {player.isActive &&
                        <Button className={'bg-gray-500'}>
                            <p className={"fa-solid fa-thumbs-down"}/>
                            <Link to={routeLinks.admin.players.status(player.id)}>{messages.buttons.deactivate}</Link>
                        </Button>
                    }
                    <RedButton>
                        <p className={"fa fa-trash mr-auto"}/>
                        <Link to={routeLinks.player.delete(player.id)}>{messages.buttons.delete}</Link>
                    </RedButton>
                </ButtonContainer>
            </td>
        </>
    );
};

export default AdminTableRow;
