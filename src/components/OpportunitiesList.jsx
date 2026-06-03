import React, { useEffect, useState } from "react";
import OpportunityCard from "./OpportunityCard";
import axiosInstance from "../api/axiosInstance";
import { filtrarOportunidades } from "../utils/filtrarOportunidades";

export default function OpportunitiesList({ currentFilters }) {
  const [displayedOpportunities, setDisplayedOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatCurrency = (value) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  useEffect(() => {
    fetchCursos();
  }, [currentFilters]);

  const fetchCursos = async () => {
    try {
      setIsLoading(true);

      const response = await axiosInstance.get("/courses");

      let cursos = response.data || [];

      cursos = cursos.filter(
        (curso) => curso.institution?.status === true
      );

      const oportunidadesMapeadas = cursos.map((curso) => ({
        id: curso.id,
        course: curso.name,
        institution: curso.institution?.name || "",
        institutionType: curso.institution?.type || "",
        city: curso.institution?.city || "",
        state: curso.institution?.state || "",
        logoUrl: curso.institution?.urlImage || "",
        percent: `${curso.percentageScholarship}%`,
        originalPrice: curso.originalValue ? formatCurrency(curso.originalValue) : "Consulte",
        discountedPrice: curso.discountValue ? formatCurrency(curso.discountValue) : "Gratuito",
        scholarshipYear: curso.scholarshipYear || 2025
      }));

      const resultados = filtrarOportunidades(oportunidadesMapeadas, currentFilters);
      setDisplayedOpportunities(resultados);
    } catch (error) {
      console.error(error);
      setDisplayedOpportunities([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#f6f8fa] py-8 md:py-10">
      <div className="mx-auto max-w-[1120px] px-5">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-extrabold text-slate-700">
            Oportunidades mais acessadas
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-sm text-slate-500">
            Carregando...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
            {displayedOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                {...opportunity}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
