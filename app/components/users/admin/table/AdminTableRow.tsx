import {User} from "@prisma/client";
import AdminRole from "~/components/users/admin/table/AdminRole";
import {Link} from "@remix-run/react";
import messages from "~/components/i18n/messages";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import RedButton from "~/components/common/buttons/RedButton";
import routeLinks from "~/helpers/constants/routeLinks";

export type AdminTableRowProps = {
    user: User;
};

const AdminTableRow = ({user}: AdminTableRowProps) => {
    return (
        <tr>
            <td className={"py-5"}>{user.name}</td>
            <td className={"text-indigo-500 underline"}>
                <a href={`mailto:${user.email}`}>{user.email}</a>
            </td>
            <td>
                <AdminRole admin={user.admin}/>
            </td>
            <td className={"text-right"}>
                <ButtonContainer className={'justify-end'}>
                    <DefaultButton>
                        <Link to={`${user.id}`}>{messages.buttons.edit}</Link>
                    </DefaultButton>
                    <RedButton>
                        <p className={"fa fa-trash mr-2"}/>
                        <Link to={`${routeLinks.admin.users.delete(user.id)}`}>{messages.buttons.delete}</Link>
                    </RedButton>
                </ButtonContainer>
            </td>
        </tr>
    );
};

export default AdminTableRow;
