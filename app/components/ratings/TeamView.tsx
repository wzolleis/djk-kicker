import {TeamModel} from "~/matches/teamTypes";

export type TeamViewProps = {
    team: TeamModel
}

const TeamView = ({team}: TeamViewProps) => {
    return (
        <div className="grid grid-cols-4 m-3 rounded-lg h-full">
            <div className={'col-span-2'}>
                <ul>
                    {team.players.map(player => {
                        return (
                            <li key={player.id} className={'text-base md:text-xl'}>{player.playerNumber}: {player.name}</li>
                        )
                    })}
                </ul>
            </div>
            <div className={'w-20 h-20 col-span-2 rounded-full flex m-5 md:m-2 justify-center items-center bg-white text-black'}>
                <h2 className={'font-default-bold text-title-large tracking-tighter text-black'}>{`${team.overallSkill}`}</h2>
            </div>
        </div>
    )

}

export default TeamView