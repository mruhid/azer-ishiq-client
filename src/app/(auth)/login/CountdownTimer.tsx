"use client";

import { motion } from "framer-motion";
import { TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function CountdownTimer({ time }: { time?: number }) {
  const [timeLeft, setTimeLeft] = useState<number>(time || 600);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 1, y: -5 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center p-2"
    >
      <div className="w-28 text-center text-2xl font-bold">
        {formatTime(timeLeft)}
      </div>
    </motion.div>
  );
}
