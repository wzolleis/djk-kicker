import {AdminInvitation} from "@prisma/client";
import messages from "~/components/i18n/messages";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {Link} from "@remix-run/react";
import RedButton from "~/components/common/buttons/RedButton";
import dateUtils from "~/dateUtils";
import {DateTime} from "luxon";
import {isAdminInvitationStatus} from "~/config/status";
import routeLinks from "~/helpers/constants/routeLinks";

const AdminInvitationTableRow = ({invitation}: { invitation: AdminInvitation }) => {
    let statusTxt = ''
    if (isAdminInvitationStatus(invitation.invitationStatus)) {
        statusTxt = messages.adminInvitationOverviewTable.invitationStatus(invitation.invitationStatus)
    }

    return (
        <tr>
            <td className={"py-5"}>{invitation.name}</td>
            <td className={"text-indigo-500 underline"}>
                <a href={`mailto:${invitation.email}`}>{invitation.email}</a>
            </td>
            <td>
                {dateUtils.dateToFormat({value: DateTime.fromJSDate(new Date(invitation.expires_at))})}
            </td>
            <td>{statusTxt}</td>
            <td className={"text-right"}>
                <ButtonContainer className={'justify-end'}>
                    <RedButton>
                        <p className={"fa fa-trash mr-2"}/>
                        <Link to={routeLinks.admin.users.invite.delete(invitation.id)}>{messages.buttons.delete}</Link>
                    </RedButton>
                </ButtonContainer>
            </td>
        </tr>
    )
}

const AdminInvitationTable = ({invitations}: { invitations: AdminInvitation[] }) => {
    return (
        <div className={"bg-white rounded-xl shadow shadow-lg shadow-indigo-200 px-5"}>
            <table className="table-auto w-full ">
                <thead className={"mb-4"}>
                <tr className={"border-b text-left"}>
                    <th className={"py-3"}>{messages.adminInvitationOverviewTable.name}</th>
                    <th className={"py-3"}>{messages.adminInvitationOverviewTable.email}</th>
                    <th className={"py-3"}>{messages.adminInvitationOverviewTable.expiresAt}</th>
                    <th className={"py-3"}>{messages.adminInvitationOverviewTable.status}</th>
                </tr>
                </thead>
                <tbody className={"mt-5"}>
                {invitations.map((invitation: AdminInvitation) => (
                    <AdminInvitationTableRow key={invitation.id} invitation={invitation}/>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminInvitationTable