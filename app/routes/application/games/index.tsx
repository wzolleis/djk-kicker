import PageHeader from "~/components/common/PageHeader";
import ToolTip from "~/components/common/ToolTip";
import messages from "~/components/i18n/messages";

const GameIndex = () => {


    return (
        <main className={"flex flex-col gap-3"}>
            <PageHeader title={"Spiele"}/>
            <ToolTip text={messages.tooltips.games.overview}></ToolTip>
        </main>
    )
}

export default GameIndex;