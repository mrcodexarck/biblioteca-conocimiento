import React, { useEffect } from 'react';

export default function GameTimer({
  timeLeft,
  setTimeLeft,
  isPaused,
  onTimeUp,
}) {
  useEffect(() => {
    if (isPaused) return;
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp, setTimeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className={`game-timer ${timeLeft <= 60 ? 'game-timer--warning' : ''}`}>
      <span className="game-timer__icon">⏱️</span>
      <span className="game-timer__time">
        {minutes}:{seconds}
      </span>
    </div>
  );
}