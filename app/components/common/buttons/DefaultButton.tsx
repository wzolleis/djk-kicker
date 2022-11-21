import type { ReactNode } from "react";

const DefaultButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={"flex items-center rounded bg-indigo-500 p-3 font-poppins-medium text-white"}
      >
        {children}
      </div>
    </>
  );
};

export default DefaultButton;
