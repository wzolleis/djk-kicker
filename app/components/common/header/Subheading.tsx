import classNames from "classnames";

const Subheading = ({ title, className }: { title: string, className?: string }) => {
  return (
    <section>
      <h2 className={classNames(className, "font-default-bold text-title-large tracking-tighter text-black")}>{title}</h2>
    </section>
  );
};

export default Subheading;
