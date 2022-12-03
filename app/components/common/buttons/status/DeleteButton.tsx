import type { ReactNode } from "react";

const DeleteButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={
          "flex items-center justify-center gap-2 rounded bg-red-600  p-3 font-default-medium text-white hover:bg-red-400"
        }
      >
        {children}
      </div>
    </>
  );
};

export default DeleteButton;
