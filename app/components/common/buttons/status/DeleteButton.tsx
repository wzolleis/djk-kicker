import type { ReactNode } from "react";

const DefaultButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={"flex items-center justify-center rounded bg-red-600  text-white p-3 font-poppins-medium hover:bg-red-400"}
      >
        {children}
      </div>
    </>
  );
};

export default DefaultButton;
