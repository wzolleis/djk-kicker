import * as React from "react";

export const RatingsImage = () => {
    return (
        <img className={"h-10 w-10 justify-center"} src="/img/ratings.svg" alt=""/>
    )
}

export const ServerImage = () => {
    return (
        <i className="fa-solid fa-server h-10 w-10 justify-center"/>
    )
}

export const UsersImage = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
    )
}

export const GamesImage = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth="1.5"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
        </svg>
    )
}