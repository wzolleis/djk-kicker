import type { ReactNode } from "react";

const SuccessButton = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div
        className={
          "flex items-center justify-center gap-2 rounded bg-green-600 py-2 px-3 font-default-medium text-white hover:bg-green-400"
        }
      >
        {children}
      </div>
    </>
  );
};

export default SuccessButton;
