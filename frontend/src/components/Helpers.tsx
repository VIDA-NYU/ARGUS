import * as React from "react";


export const format = (seconds) => {
    if (isNaN(seconds)) {
      return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };
  
export const formatTotalDuration = (time: string) => {
    const value = time.split(":");
    if (value[0].substring(0, 2) !== "0" && time.substring(1, 2) !==":") {
      return `${value[0].substring(0, 2)}:${value[1].substring(0, 2)}:${value[2].substring(0, 2)}`;
    }
    return `${value[1].substring(0, 2)}:${value[2].substring(0, 2)}`;
  };