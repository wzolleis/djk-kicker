import { ReactNode } from "react";

const TabContainer = ({ children }: { children: ReactNode }) => {

  return <>

  <section className={"flex flex-wrap gap-2"}>
    {children}
  </section>

  </>;
};

export default TabContainer;
