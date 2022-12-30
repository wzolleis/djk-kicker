const container = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
    exit: {
        opacity: 0
    }
};
const animationItems = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1,
        },
    },

};

const feedbackAnimationItems = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1.5,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 1.5,
        },
    }
};

const profileAnimationItems = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1.5,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 1.5,
        },
    }
};

export default {
    container,
    animationItems,
    feedbackAnimationItems,
    profileAnimationItems
}