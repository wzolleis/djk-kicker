import type { ReactNode } from "react";

const DefaultButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={"flex items-center rounded bg-indigo-100 ring ring-1 ring-indigo-600 text-indigo-600 p-3 font-poppins-medium"}
      >
        {children}
      </div>
    </>
  );
};

export default DefaultButton;
