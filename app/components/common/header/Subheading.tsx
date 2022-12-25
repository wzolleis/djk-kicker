const Subheading = ({ title }: { title: string }) => {
  return (
    <section>
      <h2 className={"font-default-bold text-title-large tracking-tighter text-black"}>{title}</h2>
    </section>
  );
};

export default Subheading;
