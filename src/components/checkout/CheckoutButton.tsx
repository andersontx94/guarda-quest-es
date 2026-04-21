import React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackMetaInitiateCheckout } from "@/lib/metaPixel";

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
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      onClick?.(event);

      if (event.defaultPrevented || typeof window === "undefined") {
        return;
      }

      if (typeof window.fbq === "function") {
        trackMetaInitiateCheckout(eventData);
      }

      if (newTab) {
        const openedWindow = window.open(checkoutUrl, "_blank", "noopener,noreferrer");

        if (!openedWindow) {
          window.location.assign(checkoutUrl);
        }

        return;
      }

      window.location.assign(checkoutUrl);
    };

    return <Button ref={ref} type={type} onClick={handleClick} {...props} />;
  },
);

CheckoutButton.displayName = "CheckoutButton";

export default CheckoutButton;
