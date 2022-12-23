import {useNavigate} from "@remix-run/react";
import * as React from "react";
import {useEffect} from "react";
import {setInterval} from "timers";
import {motion, useAnimation} from "framer-motion";
import DefaultButton from "~/components/common/buttons/DefaultButton";
import ButtonContainer from "~/components/common/container/ButtonContainer";
import routeLinks from "~/helpers/constants/routeLinks";
import messages from "~/components/i18n/messages";

type ErrorComponentProps = {
    title?: string;
    message?: string;
};

const ErrorComponent = ({title, message}: ErrorComponentProps) => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        controls.start("animate");
        const interval = setInterval(async () => {
            controls.start("scaleCharacters").then(() => {
                controls.start("originalStatus");
            });
        }, 5000);

        return () => clearInterval(interval);
    });
    const controls = useAnimation();

    const titleCharacterAnimation = {
        initial: {
            opacity: 0,
            scale: 2,
            y: `2em`,
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: `0em`,
            transition: {
                duration: 1,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
        originalStatus: {
            scale: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
        scaleCharacters: {
            scale: 0.5,
            y: -20,
            transition: {
                duration: 1,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
    };

    const subtextCharacterAnimation = {
        initial: {
            opacity: 0,
            scale: 2,
            y: `-2em`,
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: `0em`,
            transition: {
                duration: 1,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        },
    };

    const animationContainer = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1,
            },
        },
        originalStatus: {
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1,
            },
        },
        scaleCharacters: {
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1,
            },
        },
    };

    const errorMessage = message || "Leider ist ein Fehler aufgetreten.";
    const errorHeading = title || "Oops...";

    return (
        <>
            <div className={"flex h-full flex-col items-center gap-10"}>
                <div className={"mt-10"}>
                    <img className={"h-80"} src="/img/error.svg" alt=""/>
                </div>
                <div>
                    <motion.div className={"font-unbounded-bold text-display-large"} variants={animationContainer}
                                initial={"initial"} animate={controls}>
                        {errorHeading.split("").map((character, index) => (
                            <motion.span className={"inline-block"} key={index} variants={titleCharacterAnimation}>
                                {character}
                            </motion.span>
                        ))}
                    </motion.div>
                    <motion.div variants={animationContainer} initial={"initial"} animate={controls}>
                        <p className={"text-center font-default-semibold text-title-medium text-gray-800"}>
                            {errorMessage.split(" ").map((word, index) => (
                                <motion.span className={"mr-1 inline-block"} key={index}
                                             variants={subtextCharacterAnimation}>
                                    {word}
                                </motion.span>
                            ))}
                        </p>
                    </motion.div>
                    <ButtonContainer>
                        <DefaultButton>
                            <button onClick={() => navigate(routeLinks.dashboard)}>{messages.appmenu.dashboard}</button>
                        </DefaultButton>
                        <DefaultButton className={'ml-auto'}>
                            <button onClick={goBack} type={"button"}>Zurück</button>
                        </DefaultButton>
                    </ButtonContainer>
                    <div className={"mt-5 flex w-full flex-col items-center gap-2"}/>
                </div>
            </div>
        </>
    );
};

export default ErrorComponent;
