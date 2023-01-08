import {json, LoaderFunction} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {getUsers} from "~/models/user.server";
import {AdminInvitation, Player, User} from "@prisma/client";
import {Link, useLoaderData} from "@remix-run/react";
import AdminTable from "~/components/users/admin/AdminTable";
import messages from "~/components/i18n/messages";
import PageHeader from "~/components/common/PageHeader";
import MainPageContent from "~/components/common/MainPageContent";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {getPlayers} from "~/models/player.server";
import PlayerTable from "~/components/users/player/table/PlayerTable";
import routeLinks from "~/config/routeLinks";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import {getAdminInvitations} from "~/models/admin.user.invitation.server";
import AdminInvitationTable from "~/components/users/admin/AdminInvitationTable";

type LoaderData = {
    users: User[];
    players: Player[];

    invitations: AdminInvitation[]
};

export const loader: LoaderFunction = async ({
                                                 request,
                                             }: {
    request: Request;
}) => {
    await requireUserId(request);
    const [users, players, invitations] = await Promise.all([getUsers(), getPlayers(), getAdminInvitations()]);

    return json<LoaderData>({users, players, invitations});
};

const Users = () => {
    const {users, players, invitations} = useLoaderData() as unknown as LoaderData;

    return (
        <>
            <div className={"flex gap-5"}>
                <PageHeader title={messages.adminLandingPage.users}/>
                <ButtonContainer className={'flex-grow'}>
                    <DefaultButton className={'ml-auto'}>
                        <Link to={routeLinks.admin.users.create}>{messages.buttons.add}</Link>
                    </DefaultButton>
                    <DefaultButton>
                        <Link to={routeLinks.admin.users.invite.create}>{messages.buttons.invite}</Link>
                    </DefaultButton>
                </ButtonContainer>
            </div>
            <MainPageContent>
                <div className={"space-y-3"}>
                    <section className={"space-y-2"}>
                        <p className={"font-default-medium text-headline-small"}>
                            {messages.user.roles.admin}
                        </p>
                        <AdminTable users={users}/>
                    </section>
                    <section className={"space-y-2"}>
                        <p className={"font-default-medium text-headline-small"}>
                            {messages.adminUsersForm.invitations}
                        </p>
                        <AdminInvitationTable invitations={invitations}/>
                    </section>

                    <section className={"space-y-2"}>
                        <p className={"font-default-medium text-headline-small"}>
                            {messages.user.roles.player}
                        </p>
                        <PlayerTable players={players}/>
                    </section>
                </div>
            </MainPageContent>
        </>
    );
};

export default Users;
