import {ActionFunction, json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import {findMailRequestByGameId} from "~/models/mailservice.server";
import {MailServiceRequest} from "@prisma/client";
import ContentContainer from "~/components/common/container/ContentContainer";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import {Form, useActionData, useLoaderData} from "@remix-run/react";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import {GameMailJob, GameMailStatusResponse, getGameMailStatus} from "~/helpers/mail/mailServiceHelper";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import SubmitButton from "~/components/common/buttons/submitButton";

type LoaderData = {
    requests: MailServiceRequest[]
}

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    const requests: MailServiceRequest[] = await findMailRequestByGameId({gameId})
    return json<LoaderData>({requests});
};

const ActionStatusRequestFormFieldValues = ["intent"] as const
export type ActionStatusFormFields = typeof ActionStatusRequestFormFieldValues[number]


export const action: ActionFunction = async ({request, params: {gameId}}) => {
    invariant(typeof gameId === 'string')
    const requests = await findMailRequestByGameId({gameId})
    const statusResult: Promise<GameMailStatusResponse>[] = []

    for (let i = 0; i < requests.length; i++) {
        const request = requests[i]
        statusResult.push(getGameMailStatus(request.requestId))
    }
    const result = await Promise.all(statusResult)
    return json<GameMailStatusResponse[]>(result)
}

const ActionCard = ({request, jobs}: { request: MailServiceRequest, jobs: GameMailJob[] }) => {
    return (
        <div className={`flex items-center p-3 rounded-xl ring ring-1`}>
            <div className="">
                <div className={"flex gap-2 items-center"}>
                    <p className="text-sm text-gray-500 truncate">
                        {dateUtils.format(new Date(request.updatedAt))}
                    </p>
                    <p className="text-title-medium text-black font-default-bold">
                        {jobs.length === 0 && <span>Status unbekannt</span>}
                        {jobs.map((job) => {
                            return (
                                <span key={job.mailAddress}>
                                    {job.mailAddress} - {job.status}
                                </span>
                            )
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}


const ActionList = ({requests}: { requests: MailServiceRequest[] }) => {
    const actionStatusResponses = useActionData<GameMailStatusResponse[]>() ?? [];
    return (
        <ContentContainer>
            <h1 className={"font-default-bold text-title-large"}>{messages.adminGameActionsForm.title}</h1>
            <div className={"flex flex-col gap-4"}>
                {
                    requests.map((request) => {

                            const allJobs: GameMailJob[] = actionStatusResponses.flatMap((x) => x.jobs)
                            const jobsForRequest: GameMailJob[] = allJobs.filter(job => job.requestId === request.requestId)
                            return (
                                <ActionCard key={request.id} request={request} jobs={jobsForRequest}/>
                            )
                        }
                    )}
            </div>
        </ContentContainer>
    )
}

const ActionHistory = () => {
    const {requests} = useLoaderData<LoaderData>();
    return (
        <div>
            <Form method={'post'}>
                {/* @ts-ignore */}
                <ActionList requests={requests}/>
                <ButtonContainer className={"flex justify-end my-2 md:my-5"}>
                    <DefaultButton>
                        <SubmitButton label={'Status abfragen'} showTransitionSpinner={true}/>
                    </DefaultButton>
                </ButtonContainer>
            </Form>
        </div>
    )
}

export default ActionHistory