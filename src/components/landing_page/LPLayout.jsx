import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

/**
 * Layout exclusivo para a Landing Page (LP). Aqui fica o menu e footer diferentes do portal.
 */
export default function LPLayout() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      
      {/* 
          Aqui ficara o header
          <LPHeader /> 
      */}

      <main>
        <Outlet />
      </main>

      {/* 
          Aqui ficara o footer
          <LPFooter /> 
      */}
    </div>
  );
}
