import SetStatusButton from "~/components/common/buttons/SetStatusButton";
import { configuration } from "~/config";
import messages from "~/components/i18n/messages";

type PlayerFeedbackProps = {
  status: number;
  setStatus: any;
};

export const PlayerStatus = ({ status, setStatus }: PlayerFeedbackProps) => {
  return (
    <>
      <div className={"flex w-full items-center justify-start gap-5"}>
        <SetStatusButton
          image={"/img/thumbs-up.png"}
          onClick={() => setStatus(configuration.status.confirmed)}
          isActive={status === configuration.status.confirmed}
          activeColor={"green-500"}
        />
        <SetStatusButton
          image={"/img/thumbs-down.png"}
          onClick={() => setStatus(configuration.status.declined)}
          isActive={status === configuration.status.declined}
          activeColor={"red-500"}
        />
        <SetStatusButton
          image={"/img/thinking.png"}
          onClick={() => setStatus(configuration.status.undecided)}
          isActive={status === configuration.status.undecided}
          activeColor={"yellow-500"}
        />
      </div>
    </>
  );
};
