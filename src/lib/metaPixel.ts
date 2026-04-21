const META_PIXEL_ID = "1635883900786136";
const META_PIXEL_SCRIPT_ID = "meta-pixel-script";
const META_PIXEL_SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";

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

let metaPixelInitialized = false;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function createMetaPixelStub() {
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

export function initializeMetaPixel() {
  if (!isBrowser()) return;

  if (typeof window.fbq !== "function") {
    const fbq = createMetaPixelStub();
    window.fbq = fbq;

    if (!window._fbq) {
      window._fbq = fbq;
    }
  }

  const existingScript = document.getElementById(META_PIXEL_SCRIPT_ID);

  if (!existingScript) {
    const script = document.createElement("script");
    script.id = META_PIXEL_SCRIPT_ID;
    script.async = true;
    script.src = META_PIXEL_SCRIPT_SRC;
    document.head.appendChild(script);
  }

  if (!metaPixelInitialized) {
    window.fbq?.("init", META_PIXEL_ID);
    metaPixelInitialized = true;
  }
}

function canTrackMetaEvent() {
  return isBrowser() && typeof window.fbq === "function";
}

export function trackMetaPageView() {
  if (!canTrackMetaEvent()) return;
  window.fbq?.("track", "PageView");
}

export function trackMetaInitiateCheckout(payload?: Record<string, unknown>) {
  if (!canTrackMetaEvent()) return;
  window.fbq?.("track", "InitiateCheckout", payload);
}

export { META_PIXEL_ID };
