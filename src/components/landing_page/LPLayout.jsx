import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

export default function LPLayout() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />

      <main>
        <Outlet />
      </main>

    </div>
  );
}
