import { useMemo } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

export type TDeviceType = "mobile" | "tablet" | "desktop";

export interface IBreakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface IDeviceInfo {
  width: number | null;
  height: number | null;
  deviceType: TDeviceType | null;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isExtraLargeScreen: boolean;
}

const DEFAULT_BREAKPOINTS: IBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * Custom hook for detecting device type and screen size breakpoints
 *
 * @param customBreakpoints - Optional custom breakpoint values (defaults to Tailwind breakpoints)
 * @returns Device information including type, dimensions, and breakpoint flags
 *
 * @example
 * ```tsx
 * const { isMobile, isTablet, deviceType } = useDevice();
 *
 * if (isMobile) {
 *   return <MobileNav />;
 * }
 * ```
 */
export function useDevice(
  customBreakpoints?: Partial<IBreakpoints>
): IDeviceInfo {
  const { width, height } = useWindowSize();

  const breakpoints = useMemo(
    () => ({ ...DEFAULT_BREAKPOINTS, ...customBreakpoints }),
    [customBreakpoints]
  );

  const deviceInfo = useMemo<IDeviceInfo>(() => {
    // Handle SSR or initial render where width is null
    if (width === null) {
      return {
        width: null,
        height: null,
        deviceType: null,
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        isSmallScreen: false,
        isMediumScreen: false,
        isLargeScreen: false,
        isExtraLargeScreen: false,
      };
    }

    // Determine device type based on width
    let deviceType: TDeviceType;
    if (width < breakpoints.md) {
      deviceType = "mobile";
    } else if (width < breakpoints.lg) {
      deviceType = "tablet";
    } else {
      deviceType = "desktop";
    }

    return {
      width,
      height,
      deviceType,
      isMobile: deviceType === "mobile",
      isTablet: deviceType === "tablet",
      isDesktop: deviceType === "desktop",
      isSmallScreen: width >= breakpoints.sm,
      isMediumScreen: width >= breakpoints.md,
      isLargeScreen: width >= breakpoints.lg,
      isExtraLargeScreen: width >= breakpoints.xl,
    };
  }, [width, height, breakpoints]);

  return deviceInfo;
}
