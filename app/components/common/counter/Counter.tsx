import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: number;
  color: string;
};
const Counter = ({ value, color }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount >= value) {
          clearInterval(interval);
          return prevCount;
        }
        return prevCount + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <>
      <p className={`font-poppins-bold text-headline-medium ${color} `}>{count}</p>
    </>
  );
};

export default Counter;
