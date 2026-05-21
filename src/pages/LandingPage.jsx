import { About_app } from "../components/landing_page/About-app";
import { BenefitInfo } from "../components/landing_page/Benefit-info";
import { Partners } from "../components/landing_page/Partners";
import { OpportunitySection } from "../components/landing_page/OpportunitySection";
import { Testimonials } from "../components/landing_page/Testimonials";
import { HeaderLP } from "../components/landing_page/HeaderLP";

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
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // Um pequeno delay garante que a página já renderizou antes de rolar
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Se não tiver hash (ex: clicou na logo), vai pro topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="flex flex-col">
      <HeaderLP />

      {/* 1. Hero Section (A ser criada) */}
      <section className="bg-[#F1F5F9] py-20 text-center">
        <h1 className="text-4xl font-bold">Hero Section aqui</h1>
      </section>

      {/* 3. About-app Section */}
      <section id="como-funciona">
        <About_app />
      </section>

      {/* 4. Benefit-info Section */}
      <section id="beneficios">
        <BenefitInfo />
      </section>

      {/* 5. Opportunities Section */}
      <section id="contemplacao">
        <OpportunitySection />
      </section>

      {/* 6. Testimonials Section */}
      <section id="depoimentos">
        <Testimonials />
      </section>

      {/* 7. Partners Section */}
      <Partners />
    </div>
  );
}
