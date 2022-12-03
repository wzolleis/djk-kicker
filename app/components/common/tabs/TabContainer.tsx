import { ReactNode } from "react";

const TabContainer = ({ children }: { children: ReactNode }) => {

  return <>

  <section className={"flex gap-2"}>
    {children}
  </section>

  </>;
};

export default TabContainer;
