import React, { useEffect, useState } from "react";

export const LoadingText = (props: { text: string }) => {
  const [dots, setDots] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots === 3) {
        setDots(1);
      } else {
        setDots(dots + 1);
      }
    }, 400);
    return () => clearInterval(interval);
  });

  return <p>{props.text + ".".repeat(dots)}</p>;
};
