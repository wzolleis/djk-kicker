export const adminInvationMail = {
    mailSubject: ({expiresAt}: {expiresAt: string}) => `DJK-Kicker - Einladung zum Administrator - Gültig bis ${expiresAt}`,
    mailBody: ({
                   expiresAt,
                   einladungsLink,
                   adminName
               }: { expiresAt: string, einladungsLink: string, adminName: string }) => {
        return `Hallo ${adminName}
<br/>
Vielen Dank, dass Du uns helfen möchtest, die Spiele und Spieler der DJK-Kicker zu verwalten. 
Bitte bestätige die <a href=${einladungsLink}>Einladung als Administrator </a> bis ${expiresAt}.
<br/>
<br/>
Vielen Dank 
`
    }
}