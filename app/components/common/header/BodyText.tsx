import classNames from "classnames";

const BodyText = ({ title, className }: { title: string, className?: string }) => {
    return (
        <section>
            <p className={classNames(className, "font-default-light text-body small md:text-body-large tracking-tighter text-black")}>{title}</p>
        </section>
    );
};

export default BodyText;
