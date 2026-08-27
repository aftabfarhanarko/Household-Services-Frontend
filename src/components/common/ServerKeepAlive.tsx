"use client";

import { useEffect } from "react";

export function ServerKeepAlive() {
  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://home-services-backend-b6v4.onrender.com";

    let lastPingTime = Date.now();

    const pingBackend = async (reason: string = "periodic") => {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        
        lastPingTime = Date.now();

        if (process.env.NODE_ENV !== "production" || typeof window !== "undefined") {
          console.log(
            `%c[ServerKeepAlive] Backend ping success (${reason}): ${response.status} OK at ${new Date().toLocaleTimeString()}`,
            "color: #10b981; font-weight: bold;"
          );
        }
      } catch (error) {
        console.warn("[ServerKeepAlive] Ping failed silently:", error);
      }
    };

    // 1. Initial ping immediately when website/tab loads to wake up Render server
    pingBackend("initial_load");

    // 2. Continuous ping every 10 minutes (600,000 ms) while tab is open
    // Render free tier sleeps after 15 minutes of zero traffic
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
    const intervalId = setInterval(() => {
      pingBackend("10min_interval");
    }, PING_INTERVAL);

    // 3. Handle tab visibility change:
    // If the browser throttled timers while tab was in background,
    // ping immediately when user focuses/re-opens the tab if 10 mins have elapsed
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - lastPingTime;
        if (elapsed >= PING_INTERVAL) {
          pingBackend("tab_focused_after_inactivity");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
