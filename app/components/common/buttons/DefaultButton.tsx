import type { ReactNode } from "react";

const DefaultButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={"flex items-center justify-center rounded bg-indigo-600 gap-2 text-white transition hover:bg-indigo-400 px-3 py-2 font-default-medium"}
      >
        {children}
      </div>
    </>
  );
};

export default DefaultButton;
