import { About_app } from "../components/landing_page/About-app";
import { BenefitInfo } from "../components/landing_page/Benefit-info";
import { Partners } from "../components/landing_page/Partners";
import { OpportunitySection } from "../components/landing_page/OpportunitySection";
import { Testimonials } from "../components/landing_page/Testimonials";
import { HeaderLP } from "../components/landing_page/HeaderLP";
import { Hero } from "../components/landing_page/hero";
import { FAQ } from "../components/landing_page/Faq";
import { Footer } from "../components/landing_page/Footer";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Página principal da Landing Page.
 * Aqui é onde a gente vai importar e organizar todas as seções (Hero, About-app, Parteners, etc).
 */
export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="flex flex-col">
      <HeaderLP />

      {/* 1. Hero Section*/}
      <Hero />

      {/* 2. Benefit-info Section */}
      <section id="beneficios">
        <BenefitInfo />
      </section>

      {/* 3. About-app Section */}
      <section id="como-funciona">
        <About_app />
      </section>

      {/* 4. Opportunities Section */}
      <section id="contemplacao">
        <OpportunitySection />
      </section>

      {/* 5. Testimonials Section */}
      <section id="depoimentos">
        <Testimonials />
      </section>

      {/* 6. FAQ Section */}
      <section id="perguntas">
        <FAQ />
      </section>

      {/* 7. Partners Section */}
      <Partners />

      {/* 8. Footer Section */}
      <Footer />
    </div>
  );
}
