import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initFacebookPixel, trackPageView } from "@/lib/facebookPixel";
import "./index.css";

initFacebookPixel();
trackPageView();

createRoot(document.getElementById("root")!).render(<App />);
