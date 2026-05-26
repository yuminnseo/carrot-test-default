import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;
const HYPOTHESIS_VERSION = "Hypothesis_sequence_1";

let initialized = false;

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
