const FACEBOOK_PIXEL_ID = "1635883900786136";
const FACEBOOK_PIXEL_SCRIPT_ID = "facebook-pixel-script";
const FACEBOOK_PIXEL_SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: FbqFunction;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

let facebookPixelInitialized = false;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function createFacebookPixelStub() {
  const fbq: FbqFunction = function (...args: unknown[]) {
    if (typeof fbq.callMethod === "function") {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue?.push(args);
  } as FbqFunction;

  fbq.queue = [];
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";

  return fbq;
}

export function initFacebookPixel() {
  if (!isBrowser()) return;

  if (typeof window.fbq !== "function") {
    const fbq = createFacebookPixelStub();
    window.fbq = fbq;

    if (!window._fbq) {
      window._fbq = fbq;
    }
  }

  if (!document.getElementById(FACEBOOK_PIXEL_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = FACEBOOK_PIXEL_SCRIPT_ID;
    script.async = true;
    script.src = FACEBOOK_PIXEL_SCRIPT_SRC;

    const firstScript = document.getElementsByTagName("script")[0];

    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  if (!facebookPixelInitialized) {
    window.fbq?.("init", FACEBOOK_PIXEL_ID);
    facebookPixelInitialized = true;
  }
}

function canTrackFacebookPixelEvent() {
  return isBrowser() && typeof window.fbq === "function";
}

export function trackPageView() {
  if (!canTrackFacebookPixelEvent()) return;
  window.fbq?.("track", "PageView");
}

export function trackInitiateCheckout(payload?: Record<string, unknown>) {
  if (!canTrackFacebookPixelEvent()) return;
  window.fbq?.("track", "InitiateCheckout", payload);
}

export { FACEBOOK_PIXEL_ID };
