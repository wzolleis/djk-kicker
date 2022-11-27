import {useEffect, useState} from "react";

type CounterProps = {
    value: number,
    color: string
};
const Counter = ({value, color}: CounterProps) => {


    return <>

        <p className={"font-poppins-bold text-headline-medium " + color}>
            {value}
        </p>
    </>;
};

export default Counter;
