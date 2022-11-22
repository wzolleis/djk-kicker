import {User} from "@prisma/client";
import messages from "~/components/i18n/messages";
import AdminTableRow from "~/components/users/admin/table/AdminTableRow";
import {useState} from "react";

export type AdminTableProps = {
    users: User[];
}


const AdminTable = ({users}: AdminTableProps) => {

    const [visible, setVisible] = useState<boolean>(true)

    return (
        <>
            <div className={"bg-white rounded-xl shadow shadow-lg shadow-indigo-200 px-5"}>
                    <table className="table-auto w-full ">
                        <thead className={"mb-4"}>
                        <tr className={"border-b text-left"}>
                            <th className={"py-3"}>{messages.adminOverviewTable.name}</th>
                            <th>{messages.adminOverviewTable.email}</th>
                            <th>{messages.adminOverviewTable.role}</th>
                        </tr>
                        </thead>
                        <tbody className={"mt-5"}>
                        <tr>
                            {users.map((user: User) => (
                                <AdminTableRow key={user.id} user={user}/>
                            ))}
                        </tr>
                        </tbody>
                    </table>
            </div>
        </>
    )

}

export default AdminTable;