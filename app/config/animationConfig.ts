const container = {
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
};
const animationItems = {
    initial: {
        y: 1100,
    },
    animate: {
        y: 0,
        transition: {
            ease: [0.6, 0.01, -0.05, 0.95],
            duration: 1,
        },
    },
};

export default {
    container,
    animationItems
}