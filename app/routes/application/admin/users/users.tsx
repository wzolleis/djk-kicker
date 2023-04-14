import {json, LoaderFunction} from "@remix-run/node";
import {requireUserId} from "~/session.server";
import {getUsers} from "~/models/user.server";
import {Player, User} from "@prisma/client";
import {Link, useLoaderData} from "@remix-run/react";
import AdminTable from "~/components/users/admin/AdminTable";
import messages from "~/components/i18n/messages";
import PageHeader from "~/components/common/PageHeader";
import MainPageContent from "~/components/common/MainPageContent";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {getActiveAndInactivePlayers} from "~/models/player.server";
import PlayerTable from "~/components/users/player/table/PlayerTable";
import routeLinks from "~/config/routeLinks";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import TransitionContainer from "~/components/common/container/transitionContainer";

type LoaderData = {
    users: User[];
    players: Player[];
};

export const loader: LoaderFunction = async ({
                                                 request,
                                             }: {
    request: Request;
}) => {
    await requireUserId(request);
    const [users, players] = await Promise.all([getUsers(), getActiveAndInactivePlayers()]);

    return json<LoaderData>({users, players});
};

const Users = () => {
    const {users, players} = useLoaderData() as unknown as LoaderData;

    return (
        <TransitionContainer>
            <div className={"flex gap-5"}>
                <PageHeader title={messages.adminLandingPage.users}/>
                <ButtonContainer className={'flex-grow'}>
                    <DefaultButton className={'ml-auto'}>
                        <Link to={routeLinks.admin.users.create}>{messages.buttons.add}</Link>
                    </DefaultButton>
                    <DefaultButton>
                        <Link to={routeLinks.admin.users.ratings}>{messages.buttons.ratings}</Link>
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
                            {messages.user.roles.player}
                        </p>
                        <PlayerTable players={players}/>
                    </section>
                </div>
            </MainPageContent>
        </TransitionContainer>
    );
};

export default Users;
