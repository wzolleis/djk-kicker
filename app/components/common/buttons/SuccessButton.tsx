import type {PropsWithChildren} from "react";
import classNames from "classnames";

const SuccessButton = ({ children, className }: PropsWithChildren<{className?: string | undefined}>) => {
  return (
    <>
      <div
        className={
          classNames("flex items-center justify-center gap-2 rounded bg-green-600 py-2 px-3 font-default-medium text-white hover:scale-90", className)
        }
      >
        {children}
      </div>
    </>
  );
};

export default SuccessButton;
