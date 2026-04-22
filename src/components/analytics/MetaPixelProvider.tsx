import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/facebookPixel";

const MetaPixelProvider: React.FC = () => {
  const location = useLocation();
  const hasTrackedInitialRouteRef = useRef(false);

  useEffect(() => {
    if (!hasTrackedInitialRouteRef.current) {
      hasTrackedInitialRouteRef.current = true;
      return;
    }

    trackPageView();
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default MetaPixelProvider;
