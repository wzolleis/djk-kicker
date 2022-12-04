export const mailContent = {
    invitationMail: {
        mailSubject: (datum: string) => `Einladung für das DJK-Kicker Fussballspiel am ${datum}`,
        mailBody: ({
                       datum,
                       spielOrt,
                       einladungsLink,
                       playerName
                   }: { datum: string, spielOrt: string, einladungsLink: string, playerName: string }) => `Hallo ${playerName}
<br/>
Einladung für das Spiel am ${datum}.
<br/>
Spielort: ${spielOrt} 
<br/>
Bitte klicke auf die <a href=${einladungsLink}>Einladung</a> und teile uns mit, ob Du kommen kannst.
<br/>
Verwende den Link bitte auch, wenn Du Deine Entscheidung nochmal ändern möchtest.
<br/>
<br/>
Vielen Dank 
`
    },
    zusageMail: {
        mailSubject: (datum: string) => `Das Spiel der DJK-Kicker am ${datum} findet statt`,
        mailBody: ({
                       datum,
                       spielOrt,
                       playerName
                   }: { datum: string, spielOrt: string, playerName: string }) => `Hallo ${playerName}
<br/>
<h4> &#127952; Das Spiel findet statt. &#127952;</h4>
<p>
Datum: ${datum}
<br/>
Spielort: ${spielOrt}
</p> 
Vielen Dank für Deine Rückmeldung.
<br/>
Viele Grüße 
`
    },
    absageMail: {
        mailSubject: (datum: string) => `Das Spiel der DJK-Kicker am ${datum} fällt aus `,
        mailBody: ({
                       datum,
                       playerName
                   }: { datum: string, playerName: string }) => `Hallo ${playerName},
<br/>
<h3>
&#128557; Wir spielen nicht !!!  &#128557;
</h3>
<h4>Das Spiel am ${datum} fällt aus. </h4>
</p> 
Vielen Dank für Deine Rückmeldung.
<br/>
<br/>
Viele Grüße
`
    }
}
