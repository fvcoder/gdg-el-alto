import { useEffect, useState } from "react";

import { text } from "../../styles/text";

interface CountToDownProps {
  date: string;
}

export function CountToDown(props: CountToDownProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(props.date).getTime() - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTime({
        days,
        hours,
        minutes,
        seconds,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [props.date]);

  if (isLoading) {
    return (
      <div className="border mx-auto size-4 rounded-full animate-spin border-b-0 border-[var(--md-sys-color-primary)]"></div>
    );
  }

  return (
    <>
      {time.days !== 0 && (
        <span data-title="Dias" data-small-title="D" className="flex flex-col justify-center">
          <span className={text({ style: "titleLarge" })}>{time.days}</span>
          <span className={text({ style: "bodySmall" })}>Dias</span>
        </span>
      )}
      {time.hours !== 0 && (
        <span data-title="Horas" data-small-title="H" className="flex flex-col justify-center">
          <span className={text({ style: "titleLarge" })}>{time.hours}</span>
          <span className={text({ style: "bodySmall" })}>Horas</span>
        </span>
      )}
      {time.minutes !== 0 && (
        <span data-title="Minutos" data-small-title="M" className="flex flex-col justify-center">
          <span className={text({ style: "titleLarge" })}>{time.minutes}</span>
          <span className={text({ style: "bodySmall" })}>Minutos</span>
        </span>
      )}
      {time.seconds !== 0 && (
        <span data-title="Segundos" data-small-title="S" className="flex flex-col justify-center">
          <span className={text({ style: "titleLarge" })}>{time.seconds}</span>
          <span className={text({ style: "bodySmall" })}>Segundos</span>
        </span>
      )}
    </>
  );
}
