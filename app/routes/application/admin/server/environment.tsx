import ContentContainer from "~/components/common/container/ContentContainer";
import {ProcessEnvVariables} from "~/routes/application/admin/server/index";

export type EnviromentProps = {
    variables: ProcessEnvVariables
}

type VariableRowProps = {
    name: string
    value: string | undefined
}

const VariableTableRow = ({name, value}: VariableRowProps) => {
    return (
        <>
            <td className={"py-5"}>{name}</td>
            <td>{value ?? 'undefined'} </td>
        </>
    )
}

export const Environment = ({variables}: EnviromentProps) => {
    return (
        <ContentContainer>
            <table className="table-auto w-full ">
                <thead className={"mb-4"}>
                <tr className={"border-b text-left py-5"}>
                    <th>{'Name'}</th>
                    <th>{'Wert'}</th>
                </tr>
                </thead>
                <tbody className={"mt-5"}>
                <tr className={"border-b"} key={'DRIFTMAIL_SERVICE_URL'}>
                    <VariableTableRow name={'DRIFTMAIL_SERVICE_URL'} value={variables.DRIFTMAIL_SERVICE_URL}/>
                </tr>
                </tbody>
            </table>
        </ContentContainer>
    )
}

export default Environment