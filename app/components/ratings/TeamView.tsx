import {TeamModel} from "~/matches/teamTypes";
import {playerImageByRating} from "~/components/ratings/playerRatingImage";

export type TeamViewProps = {
    team: TeamModel
}

const TeamView = ({team}: TeamViewProps) => {
    const image = playerImageByRating({rating: team.overallSkill})

    return (
        <div className="grid grid-cols-3 m-3 rounded-lg h-full">
            <div className={'grid grid-cols-3 col-span-2 m-5 w-full pr-5'}>
                <img src={image} alt="" className="mx-3 h-24 w-24 md:h-32 md:w-32 mr-5 col-span-2"/>
                <div className={'w-20 h-20 rounded-full flex m-5 md:m-2 justify-center items-center bg-white text-black'}>
                    <h2 className={'font-default-bold text-title-large tracking-tighter text-black'}>{`${team.overallSkill}`}</h2>
                </div>
            </div>
            <div className={'col-span-3'}>
                <ul>
                    {team.players.map(player => {
                        return (
                            <li key={player.id} className={'text-base md:text-xl'}>{player.name}</li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )

}

export default TeamView