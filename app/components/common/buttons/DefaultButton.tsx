import type { ReactNode } from "react";

const DefaultButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={
          "flex items-center justify-center gap-2 rounded bg-indigo-600 px-3 py-2 font-default-medium text-white transition duration-150 ease-in-out hover:scale-90 hover:bg-indigo-400"
        }
      >
        {children}
      </div>
    </>
  );
};

export default DefaultButton;
