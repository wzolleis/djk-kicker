import type { ReactNode } from "react";

const DeleteButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={
          "flex items-center justify-center gap-2 rounded bg-red-600 py-2 px-3 font-default-medium text-white transition duration-150 ease-in-out  hover:scale-90 hover:bg-red-400"
        }
      >
        {children}
      </div>
    </>
  );
};

export default DeleteButton;
