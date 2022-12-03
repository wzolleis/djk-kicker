import {PropsWithChildren} from "react";

const ContentContainer = ({ children }: PropsWithChildren<{}>) => {
  return <div className={"rounded-xl bg-white p-3 ring ring-1 ring-indigo-100"}>{children}</div>;
};

export default ContentContainer;
