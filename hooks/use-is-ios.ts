import { useState, useEffect } from "react";

export const useIsIOS = () => {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      setIsIOS(
        ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")
      );
    }
  }, []);

  return isIOS;
};
