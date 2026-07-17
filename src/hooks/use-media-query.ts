"use client";

import * as React from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", callback);
      return () => mediaQueryList.removeEventListener("change", callback);
    },
    [query],
  );
  const getSnapshot = React.useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = React.useCallback(() => false, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Tailwind's `lg` breakpoint (64rem) is where the sidebar switches from off-canvas to persistent.
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 63.999rem)");
}
