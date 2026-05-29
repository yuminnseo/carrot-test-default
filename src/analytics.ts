import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;
const HYPOTHESIS_VERSION = "Hypothesis_sequence_1";

let initialized = false;
let debugAppOpenedSent = false;

type TrackingProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

const ensureMixpanel = () => {
  if (initialized || !MIXPANEL_TOKEN) {
    return Boolean(MIXPANEL_TOKEN);
  }

  mixpanel.init(MIXPANEL_TOKEN, {
    debug: import.meta.env.DEV,
    track_pageview: false,
    persistence: "localStorage",
  });
  initialized = true;

  return true;
};

const logMixpanelStartup = () => {
  if (typeof window === "undefined") {
    return;
  }

  console.warn("[Mixpanel] token exists:", Boolean(MIXPANEL_TOKEN));
  console.warn(
    "[Mixpanel] mode:",
    import.meta.env.MODE,
    "path:",
    window.location.pathname,
  );

  if (!ensureMixpanel() || debugAppOpenedSent) {
    return;
  }

  mixpanel.track("Debug App Opened", {
    path: window.location.pathname,
    url: window.location.href,
    mode: import.meta.env.MODE,
  });
  debugAppOpenedSent = true;
};

logMixpanelStartup();

export const trackHypothesisClick = (
  buttonName: string,
  properties: TrackingProperties = {},
) => {
  const eventProperties = {
    Version: HYPOTHESIS_VERSION,
    button_name: buttonName,
    ...properties,
  };

  if (typeof window !== "undefined") {
    const debugEvents = [
      ...((window as Window & {
        __carrotAnalyticsEvents?: typeof eventProperties[];
      }).__carrotAnalyticsEvents ?? []),
      { eventName: "Click Main Button", ...eventProperties },
    ];

    Object.defineProperty(window, "__carrotAnalyticsEvents", {
      configurable: true,
      value: debugEvents,
    });
  }

  if (!ensureMixpanel()) {
    return;
  }

  mixpanel.track("Click Main Button", eventProperties);
};

export const trackHypothesisEvent = (
  eventName: string,
  properties: TrackingProperties = {},
) => {
  const eventProperties = {
    Version: HYPOTHESIS_VERSION,
    ...properties,
  };

  if (typeof window !== "undefined") {
    const debugEvents = [
      ...((window as Window & {
        __carrotAnalyticsEvents?: (TrackingProperties & {
          eventName: string;
        })[];
      }).__carrotAnalyticsEvents ?? []),
      { eventName, ...eventProperties },
    ];

    Object.defineProperty(window, "__carrotAnalyticsEvents", {
      configurable: true,
      value: debugEvents,
    });
  }

  if (!ensureMixpanel()) {
    return;
  }

  mixpanel.track(eventName, eventProperties);
};
