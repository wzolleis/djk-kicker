import {Html} from "@react-email/html";
import {Container} from "@react-email/container";
import {Preview} from "@react-email/preview";
import {Section} from "@react-email/section";
import {Text} from "@react-email/text";
import {Button} from "@react-email/button";
import type {DateTime} from "luxon";

type InvitationEmailProps = {
    name: string,
    gameName: string,
    gameTime: DateTime,
    gameLocation: string
    gameLink: string

}


const Email = ({name, gameName, gameTime, gameLocation, gameLink}: InvitationEmailProps) => {
    const previewText = `Einladung für das Spiel am ${gameTime.toFormat('dd.MM.yyyy')}`

    return (
        <Html lang={"de"}>
            <Preview>{previewText}</Preview>

            <Section style={main}>
                <Container style={container}>
                    <Container>
                        <table align={"center"}>
                            <tr>
                                <td>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="72" height="72">
                                        <path fill="none" d="M0 0h24v24H0z"/>
                                        <path
                                            d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm1.67 14h-3.34l-1.38 1.897.554 1.706A7.993 7.993 0 0 0 12 20c.871 0 1.71-.14 2.496-.397l.553-1.706L13.669 16zm-8.376-5.128l-1.292.937L4 12c0 1.73.549 3.331 1.482 4.64h1.91l1.323-1.82-1.028-3.17-2.393-.778zm13.412 0l-2.393.778-1.028 3.17 1.322 1.82h1.91A7.964 7.964 0 0 0 20 12l-.003-.191-1.291-.937zM14.29 4.333L13 5.273V7.79l2.694 1.957 2.239-.727.554-1.703a8.014 8.014 0 0 0-4.196-2.984zm-4.582 0a8.014 8.014 0 0 0-4.196 2.985l.554 1.702 2.239.727L11 7.79V5.273l-1.291-.94z"
                                            fill="rgba(33,45,59,1)"/>
                                    </svg>
                                </td>
                            </tr>

                        </table>
                    </Container>

                    <Text style={h1}>Einladung für das <strong>{gameName}</strong> am <span
                        style={textIndigo}>{gameTime.toFormat('dd.MM.yyyy')}</span></Text>


                    <Container>
                        <Text style={text}>
                            Hallo <strong style={textIndigo}>{name}</strong>,
                        </Text>
                        <Text style={textMain}>
                            Du bist zum <strong>Fußballspiel</strong> am <span
                            style={textIndigo}>{gameTime.toFormat('dd.MM.yyyy')}</span> um
                            {gameTime.toFormat('HH:mm')} <strong>eingeladen!</strong> Das Spiel
                            findet {gameLocation} statt.
                        </Text>

                        <Text style={textMain}>
                            Bitte teile uns doch mit, ob du kommen kannst. Klicke dafür einfach auf den Link!
                        </Text>


                        <Container>
                            <table align={"center"}>
                                <tr>
                                    <td>
                                        <Button
                                            pX={12}
                                            pY={16}
                                            style={button}
                                            href={gameLink}
                                        >
                                            Spiel ansehen
                                        </Button>
                                    </td>
                                </tr>
                            </table>

                        </Container>

                    </Container>
                </Container>

            </Section>

        </Html>

    )


};


const h1 = {
    color: '#000',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '24px',
    fontWeight: 'normal',
    textAlign: 'center' as const,
    margin: '30px 0',
    padding: '0',
};

const textIndigo = {
    color: '#4f46e5',

}

const button = {
    backgroundColor: '#4f46e5',
    borderRadius: '10px',
    color: '#fff',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '16px',
    fontWeight: 500,
    lineHeight: '50px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    width: '200px'
}


const text = {
    color: '#000',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '20px',
    lineHeight: '24px',
}
const textMain = {
    color: '#000',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '16px',
    lineHeight: '24px',
}


const main = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
};


const container = {
    border: '1px solid #eaeaea',
    borderRadius: '5px',
    margin: '40px auto',
    padding: '20px',
    width: '600px',
};


export default Email;