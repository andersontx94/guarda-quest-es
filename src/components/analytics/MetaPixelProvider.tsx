import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initializeMetaPixel, trackMetaPageView } from "@/lib/metaPixel";

const MetaPixelProvider: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    initializeMetaPixel();
  }, []);

  useEffect(() => {
    trackMetaPageView();
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default MetaPixelProvider;
