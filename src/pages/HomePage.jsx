import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FiltroCursos from "../components/FiltroCursos";
import OpportunitiesList from "../components/OpportunitiesList";
import Steps from "../components/Steps";
import About from "../components/About";
import Footer from "../components/Footer";

function HomePage() {
  const [filters, setFilters] = useState({
    tab: "Escola",
    cidade: "",
    curso: "",
    instituicao: "",
    bolsa: 0,
    // modalidade: { presencial: true, ead: true }
  });

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleBuscar = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="w-full h-[340px] md:h-[670px] lg:h-[472px] bg-cover bg-[url('/assets/banners/banner-proledupass-mobile.jpeg')] lg:bg-[url('/assets/banners/banner-proledupass.jpeg')]"></section>
      <FiltroCursos onBuscar={handleBuscar} initialFilters={filters} />
      <OpportunitiesList currentFilters={filters} />
      <Steps />
      <About />
      <Footer />
    </div>
  );
}

export default HomePage;
