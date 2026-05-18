import { About_app } from "../components/landing_page/About-app";
import { BenefitInfo } from "../components/landing_page/Benefit-info";

/**
 * Página principal da Landing Page.
 * Aqui é onde a gente vai importar e organizar todas as seções (Hero, About-app, Parteners, etc).
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (A ser criada) */}
      <section className="bg-[#F1F5F9] py-20 text-center">
        <h1 className="text-4xl font-bold">Hero Section aqui</h1>
      </section>

      {/* 2. About-app Section */}
      <About_app />

      {/* 3. Benefit-info Section */}
      <BenefitInfo />
    </div>
  );
}
