import {json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import {findMailRequestByGameId} from "~/models/mailservice.server";
import {MailServiceRequest} from "@prisma/client";
import ContentContainer from "~/components/common/container/ContentContainer";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import {useLoaderData} from "@remix-run/react";
import {GameMailJob, GameMailStatusResponse, getGameMailStatus} from "~/helpers/mail/mailServiceHelper";
import {DateTime} from "luxon";
import {groupBy} from "lodash";

type LoaderData = {
    requests: MailServiceRequest[]
    jobs: GameMailJob[]
}

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    const requests: MailServiceRequest[] = await findMailRequestByGameId({gameId})
    const statusResult: Promise<GameMailStatusResponse>[] = []

    for (let i = 0; i < requests.length; i++) {
        const request = requests[i]
        statusResult.push(getGameMailStatus(request.requestId))
    }
    const requestStatus = await Promise.all(statusResult)
    const jobs = requestStatus.flatMap(status => status.jobs)

    return json<LoaderData>({requests, jobs});
};

const jobsToMailddress = (jobs: GameMailJob[]) => {
    return jobs.map((job) => `${job.mailAddress}`).join()
}

const ActionCard = ({request, jobs}: { request: MailServiceRequest, jobs: GameMailJob[] }) => {
    /* @ts-ignore */
    const requestTypeLabel = messages.commonForm.requestType[request.requestType ?? 'unknownRequest'] as string
    const groupdByStatus = groupBy(jobs, (job) => job.status)

    return (
        <div className={`flex items-center p-3 rounded-xl ring ring-1`}>
            <div className="">
                <div className={"flex gap-2 items-center"}>
                    <p className="text-sm text-gray-500 truncate">
                        {`${dateUtils.format(new Date(request.updatedAt))} - ${requestTypeLabel ?? request.requestType}`}
                    </p>
                    <p className="text-title-medium text-black font-default-bold">
                        {jobs.length === 0 && <span>Keine Mail Jobs</span>}

                        {
                            Object.keys(groupdByStatus).map((key) => {
                                const jobsForStatus = groupdByStatus[key]
                                return (
                                    <span key={key}>{`${key}: ${jobsToMailddress(jobsForStatus)}`}</span>
                                )
                            })
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

const ActionList = ({requests, jobs}: { requests: MailServiceRequest[], jobs: GameMailJob[] }) => {
    requests.sort((r1, r2) => {
        const dt1 = DateTime.fromJSDate(r1.updatedAt)
        const dt2 = DateTime.fromJSDate(r2.updatedAt)
        if (dt1 == dt2) return 0
        if (dt1 > dt2) return 1
        else return -1
    })

    return (
        <ContentContainer>
            <h1 className={"font-default-bold text-title-large"}>{messages.adminGameActionsForm.title}</h1>
            <div className={"flex flex-col gap-4"}>
                {
                    requests.map((request) => {

                            const jobsForRequest: GameMailJob[] = jobs.filter(job => job.requestId === request.requestId)
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
    const {requests, jobs} = useLoaderData<LoaderData>();
    return (
        <>
            {/* @ts-ignore */}
            <ActionList requests={requests} jobs={jobs}/>
        </>
    )
}

export default ActionHistory