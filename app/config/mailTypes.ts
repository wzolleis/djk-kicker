export type SendMailStatus = 200 | 400 | 500
export type SendMailResponse = {
    status: SendMailStatus
    statusTxt: string
}
