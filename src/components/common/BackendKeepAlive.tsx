"use client";

import { useEffect } from "react";

export default function BackendKeepAlive() {
  useEffect(() => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://home-services-backend-m3pm.onrender.com";
    const healthUrl = `${rawApiUrl.replace(/\/$/, "")}/health`;

    // Ping function
    const pingBackend = async () => {
      try {
        await fetch(healthUrl, { method: "GET", mode: "cors" });
      } catch (error) {
        // Silently catch network errors
      }
    };

    // Immediate ping on frontend load
    pingBackend();

    // Ping every 10 minutes (600,000 ms) while frontend tab is open
    const interval = setInterval(pingBackend, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
