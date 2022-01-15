import { useState, useEffect, useRef } from "react";

function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default function Countdown({ lockInTime }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useInterval(() => {
    const finalTime = new Date(lockInTime).getTime();
    let now = new Date().getTime();
    let distance = finalTime - now;
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    // let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setTimeLeft(`${days}d ${hours}h ${minutes}m`);
  }, 1000);
  return (
    <div>
      <p>Time until lockin: {timeLeft}</p>
    </div>
  );
}
