import React, { useEffect, useState } from 'react';

export default function GameTimer({ duration, onTimeUp, isPaused }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (isPaused) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className={`game-timer ${timeLeft <= 60 ? 'game-timer--warning' : ''}`}>
      <span className="game-timer__icon">⏱️</span>
      <span className="game-timer__time">{minutes}:{seconds}</span>
    </div>
  );
}