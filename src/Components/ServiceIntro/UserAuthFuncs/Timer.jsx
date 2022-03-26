import React, { useState, useEffect } from "react";

export default function Timer({ onStop }) {
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(seconds) === 0) {
        clearInterval(countdown);
        onStop();
      }
      setSeconds(parseInt(seconds) - 1);
    }, 1000);
    return () => {
      clearInterval(countdown);
    };
  }, [seconds]);

  return (
    <h2>
      {parseInt(seconds / 60)}:{seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
    </h2>
  );
}
