import React, { useEffect, useRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackInitiateCheckout } from "@/lib/facebookPixel";

// Loads Hotmart widget script + CSS once per page
let hotmartWidgetLoaded = false;
function loadHotmartWidget() {
  if (hotmartWidgetLoaded || typeof window === "undefined") return;
  hotmartWidgetLoaded = true;

  const script = document.createElement("script");
  script.src = "https://static.hotmart.com/checkout/widget.min.js";
  document.head.appendChild(script);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://static.hotmart.com/css/hotmart-fb.min.css";
  document.head.appendChild(link);
}

interface CheckoutButtonProps extends Omit<ButtonProps, "onClick"> {
  checkoutUrl: string;
  eventData?: Record<string, unknown>;
  newTab?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CheckoutButton = React.forwardRef<HTMLButtonElement, CheckoutButtonProps>(
  (
    {
      checkoutUrl,
      eventData,
      newTab = false,
      onClick,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const anchorRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
      loadHotmartWidget();
    }, []);

    const popupUrl = checkoutUrl.includes("?")
      ? `${checkoutUrl}&checkoutMode=2`
      : `${checkoutUrl}?checkoutMode=2`;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      onClick?.(event);

      if (event.defaultPrevented || typeof window === "undefined") {
        return;
      }

      trackInitiateCheckout(eventData);

      // Trigger the hidden anchor — Hotmart widget intercepts and opens popup.
      // Falls back to redirect if widget hasn't initialised yet.
      if (anchorRef.current) {
        anchorRef.current.click();
        return;
      }

      if (newTab) {
        const openedWindow = window.open(checkoutUrl, "_blank", "noopener,noreferrer");
        if (!openedWindow) window.location.assign(checkoutUrl);
        return;
      }

      window.location.assign(checkoutUrl);
    };

    return (
      <>
        {/* Hidden anchor the Hotmart widget listens on to open the popup */}
        <a
          ref={anchorRef}
          href={popupUrl}
          className="hotmart-fb hotmart__button-checkout"
          style={{ position: "absolute", left: "-9999px", visibility: "hidden" }}
          aria-hidden="true"
          tabIndex={-1}
        />
        <Button ref={ref} type={type} onClick={handleClick} {...props} />
      </>
    );
  },
);

CheckoutButton.displayName = "CheckoutButton";

export default CheckoutButton;
