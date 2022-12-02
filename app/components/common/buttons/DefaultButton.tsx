import type { ReactNode } from "react";

const DefaultButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={"flex items-center justify-center rounded bg-indigo-600  text-white transition hover:bg-indigo-400 p-3 font-poppins-medium"}
      >
        {children}
      </div>
    </>
  );
};

export default DefaultButton;
