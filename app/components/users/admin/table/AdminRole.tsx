import messages from "~/components/i18n/messages";

const AdminRole = ({ admin }: { admin: boolean }) => {
  return (
    <>
      <div className={"flex "}>
        <div
          className={`flex rounded-full px-3 py-1 font-sans text-label-large font-medium  ${
            admin
              ? "bg-green-300/50 text-green-800"
              : "bg-red-300 text-red-800"
          }`}
        >
          {admin ? messages.user.roles.admin : messages.user.roles.player}
        </div>
      </div>
    </>
  );
};

export default AdminRole;
