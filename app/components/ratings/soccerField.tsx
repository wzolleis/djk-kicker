/* This example requires Tailwind CSS v2.0+ */
import React from 'react';
import SoccerLineUp from 'react-soccer-lineup'
import {Squad} from 'react-soccer-lineup/dist/components/team/Team';
import {TeamModel} from "~/matches/teamTypes";
import {Player as SoccerPlayer} from 'react-soccer-lineup/dist/components/team/player/Player';
import {isPlayerPosition} from "~/components/ratings/playerRatingTypes";


type SoccerFieldProps = {
    home: TeamModel
    away: TeamModel
}

const hasCapacity = (players: SoccerPlayer[]) => players.length < 2

const teamToSquad = (teamModel: TeamModel): Squad => {

    let gk: SoccerPlayer | undefined = undefined
    let df: SoccerPlayer[] = []
    let fw: SoccerPlayer[] = []
    let cm: SoccerPlayer[] = []
    let cdm: SoccerPlayer[] = []
    let cam: SoccerPlayer[] = []

    teamModel.players.forEach((player) => {
        if (isPlayerPosition(player.position)) {
            switch (player.position) {
                case "Goalkeeper":
                    if (gk === undefined) {
                        gk = {name: player.name}
                    } else {
                        df.push({name: player.name})
                    }
                    break
                case "Attacker":
                    if (hasCapacity(fw)) {
                        fw.push({name: player.name})
                    } else if (hasCapacity(cam)) {
                        cam.push({name: player.name})
                    } else if (hasCapacity(cm)) {
                        cm.push({name: player.name})
                    } else {
                        cdm.push({name: player.name})
                    }
                    break
                default:
                case "Defender":
                    df.push({name: player.name})
                    break
            }
        }
    })


    df = df.map(_ => {
        return {
            name: ''
        }
    })

    return {gk, df, fw, cm, cdm, cam}
}

const SoccerField = ({home, away}: SoccerFieldProps) => {
    const homeTeam = teamToSquad(home)
    const awayTeam = teamToSquad(away)
    return (
        <SoccerLineUp
            size={"responsive"}
            color={"lightseagreen"}
            pattern={"lines"}
            homeTeam={{squad: homeTeam}}
            awayTeam={{squad: awayTeam}}
        />
    );
}
export default SoccerField