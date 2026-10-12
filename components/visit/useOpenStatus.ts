"use client";

import { useSyncExternalStore } from "react";
import { getOpenStatus, type OpenStatus } from "@/data/cafe";

// Ticks once a minute; the snapshot is the current minute so React re-renders on change
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
}
const currentMinute = () => Math.floor(Date.now() / 60_000);
const serverMinute = () => null;

/** Live open/closed status in the visitor's time zone. `null` during server render. */
export function useOpenStatus(): OpenStatus | null {
  const minute = useSyncExternalStore(subscribe, currentMinute, serverMinute);
  return minute === null ? null : getOpenStatus(new Date(minute * 60_000));
}
