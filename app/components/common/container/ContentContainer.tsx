import {PropsWithChildren} from "react";
import classNames from "classnames";

const ContentContainer = ({ children, className }: PropsWithChildren<{className?: string}>) => {
  return <div className={classNames(className, "rounded-xl bg-white p-3 ring ring-1 ring-indigo-100")}>{children}</div>;
};

export default ContentContainer;
