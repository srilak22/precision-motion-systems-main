import type { IndusAnalyticsEvent } from "./lib/analytics/tracker";

export declare function trackDigitalPresence(
  event?: string,
  element?: string,
  details?: string,
  extra?: Partial<IndusAnalyticsEvent>
): Promise<void>;

export declare function getDeviceDetails(): {
  device: "Desktop" | "Tablet" | "Mobile";
  browser: string;
  operatingSystem: string;
  screen: string;
};

export declare function getSessionId(): string;
