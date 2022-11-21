import {User} from "@prisma/client";
import AdminRole from "~/components/users/admin/table/AdminRole";
import {Link} from "@remix-run/react";
import messages from "~/components/i18n/messages";

export type AdminTableRowProps = {
    user: User;
};

const AdminTableRow = ({user}: AdminTableRowProps) => {
    return (
        <>
            <td className={"py-5"}>{user.name}</td>
            <td className={"text-indigo-500 underline"}>
                <a href={`mailto:${user.email}`}>{user.email}</a>
            </td>
            <td>
                <AdminRole admin={user.admin}/>
            </td>
            <td className={"text-right"}>
                <Link
                    to={`${user.id}`}
                    className={
                        "rounded bg-indigo-500 shadow shadow-lg  shadow-indigo-500/40 px-3 py-2 font-sans  text-white "
                    }
                >{messages.buttons.edit}
                </Link>
            </td>
        </>
    );
};

export default AdminTableRow;
