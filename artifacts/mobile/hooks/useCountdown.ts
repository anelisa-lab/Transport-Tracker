import { useEffect, useState } from "react";

export interface CountdownResult {
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
  isImminent: boolean;
  isPast: boolean;
}

function parseNextDeparture(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

export function useCountdown(departureTime: string): CountdownResult {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = parseNextDeparture(departureTime);
  const diffMs = target.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const isPast = diffMs <= 0;
  const isImminent = totalSeconds < 300 && !isPast;

  let label: string;
  if (isPast) {
    label = "Departed";
  } else if (totalSeconds < 60) {
    label = "Departing now!";
  } else if (hours === 0) {
    label = `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  } else {
    label = `${hours}h ${minutes}m`;
  }

  return { totalSeconds, hours, minutes, seconds, label, isImminent, isPast };
}

export function useNextRoute(
  routes: Array<{ departureTime: string; id: string }>
) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const sorted = [...routes].sort((a, b) => {
    const msA = secsUntil(a.departureTime, now);
    const msB = secsUntil(b.departureTime, now);
    return msA - msB;
  });

  return sorted[0] ?? null;
}

function secsUntil(timeStr: string, now: Date): number {
  const [h, m] = timeStr.split(":").map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return Math.floor((target.getTime() - now.getTime()) / 1000);
}
