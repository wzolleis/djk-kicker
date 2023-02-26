import {json, LoaderFunction} from "@remix-run/node";
import invariant from "tiny-invariant";
import {findMailRequestByGameId} from "~/models/mailservice.server";
import {MailServiceRequest} from "@prisma/client";
import ContentContainer from "~/components/common/container/ContentContainer";
import messages from "~/components/i18n/messages";
import dateUtils from "~/dateUtils";
import {useLoaderData} from "@remix-run/react";
import {DateTime} from "luxon";
import {groupBy} from "lodash";
import {DriftMailStatusResponse} from "driftmail";
import {DriftMailJob, FailedDriftMailJob, fetchDriftMailStatus} from "~/helpers/mail/mailService";

type DriftMailJobData = {
    sucessfull: DriftMailJob[]
    waiting: DriftMailJob[]
    failed: FailedDriftMailJob[]
}

type LoaderData = {
    requests: MailServiceRequest[]

    jobData: DriftMailJobData

}

export const loader: LoaderFunction = async ({params: {gameId}}) => {
    invariant(gameId, "Expected params.gameId");
    const requests: MailServiceRequest[] = await findMailRequestByGameId({gameId})
    const statusResult: Promise<DriftMailStatusResponse>[] = []

    for (let i = 0; i < requests.length; i++) {
        const request = requests[i]
        statusResult.push(fetchDriftMailStatus(request.requestId))
    }
    const requestStatus = await Promise.all(statusResult)

    const jobData: DriftMailJobData = {
        failed: [],
        sucessfull: [],
        waiting: []
    }

    jobData.failed = requestStatus.flatMap(status => status.getFailed())
    jobData.sucessfull = requestStatus.flatMap(status => status.getSuccessful())
    jobData.waiting = requestStatus.flatMap(status => status.getWaiting())

    return json<LoaderData>({requests, jobData});
};

const mapJobsToMailddress = (jobs: DriftMailJob[]) => {
    return jobs.map((job) => `${job.mail_address}`).join()
}

const ActionCard = ({request, jobs}: { request: MailServiceRequest, jobs: DriftMailJob[] }) => {
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
                                    <span key={key}>{`${key}: ${mapJobsToMailddress(jobsForStatus)}`}</span>
                                )
                            })
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

const ActionList = ({requests, jobData}: { requests: MailServiceRequest[], jobData: DriftMailJobData }) => {
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
                <span>Successfull</span>
                {
                    requests.map((request) => {
                            const jobsForRequest: DriftMailJob[] = jobData.sucessfull.filter(job => job.request_id === request.requestId)
                            return (
                                <ActionCard key={request.id} request={request} jobs={jobsForRequest}/>
                            )
                        }
                    )}
            </div>
            <div className={"flex flex-col gap-4"}>
                <span>Waiting</span>
                {
                    requests.map((request) => {
                            const jobsForRequest: DriftMailJob[] = jobData.waiting.filter(job => job.request_id === request.requestId)
                            return (
                                <ActionCard key={request.id} request={request} jobs={jobsForRequest}/>
                            )
                        }
                    )}
            </div>
            <div className={"flex flex-col gap-4"}>
                <span>Failed</span>
                {
                    requests.map((request) => {
                            const jobsForRequest: DriftMailJob[] = jobData.failed.filter(job => job.request_id === request.requestId)
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
    const {requests, jobData} = useLoaderData<LoaderData>();
    return (
        <>
            {/* @ts-ignore */}
            <ActionList requests={requests} jobData={jobData}/>
        </>
    )
}

export default ActionHistory