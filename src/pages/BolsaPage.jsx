// src/pages/BolsaPage.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";
import LoadingSpinner from "../components/LoadingSpinner";

import { ArrowLeft, MapPin, Building2, Clock, Tag } from "lucide-react";

const BackArrowIcon = ({ className = "w-5 h-5 mr-2" }) => (
  <ArrowLeft className={className} />
);

const MapPinIcon = () => <MapPin className="w-5 h-5 text-slate-500" />;
const BuildingOfficeIcon = () => (
  <Building2 className="w-5 h-5 text-slate-500" />
);
const ClockIcon = () => <Clock className="w-5 h-5 text-slate-500" />;
const TagIcon = () => <Tag className="w-5 h-5 text-[#F15050]" />;

export default function BolsaPage() {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!id) {
      setError("ID da oportunidade não fornecido.");
      setLoading(false);
      return;
    }
    axiosInstance
      .get(`/courses/${id}`)
      .then((response) => {
        setOpportunity(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar curso:", err);
        setError(
          err.response?.status === 404
            ? "Oportunidade não encontrada."
            : "Erro ao carregar os dados do curso.",
        );
        setLoading(false);
      });
  }, [id]);

  const handleInscricaoClick = () => {
    if (!user) {
      navigate("/portal/login", { state: { from: `/portal/bolsa/${id}` } });
    } else {
      navigate(`/portal/inscricao/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex justify-center items-center bg-slate-50">
        <LoadingSpinner size="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex flex-col justify-center items-center bg-slate-50 p-6 text-center">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <Link to="/portal" className="btn btn-primary">
          Voltar para Home
        </Link>
      </div>
    );
  }
  if (!opportunity) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex flex-col justify-center items-center bg-slate-50 p-6 text-center">
        <p className="text-slate-700 text-xl mb-4">
          Oportunidade não encontrada.
        </p>
        <Link to="/portal" className="btn btn-primary">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const institution = opportunity.institutions || opportunity.institution || {};
  const locationString =
    [institution.city, institution.state].filter(Boolean).join(", ") ||
    "Localização não informada";
  const fullAddress =
    `${institution.street || ""}, ${institution.number || ""}${institution.complement ? " - " + institution.complement : ""} - ${institution.neighborhood || ""}, ${locationString}`
      .replace(/ , |, - | - /g, ", ")
      .replace(/^,|, $/g, "");

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Botão Voltar */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-150 group"
          >
            <BackArrowIcon className="w-5 h-5 mr-1.5 text-slate-500 group-hover:text-blue-500 transition-colors" />
            Voltar
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-x-12 items-start">
          <div className="lg:col-span-2 mb-8 lg:mb-0">
            <div className="aspect-w-16 aspect-h-9 bg-slate-100 rounded-xl shadow-lg overflow-hidden mb-6">
              <img
                src={
                  opportunity.imageUrl ||
                  institution.urlImage ||
                  "https://via.placeholder.com/800x450/E2E8F0/94A3B8?text=Curso"
                }
                alt={`Imagem do curso ${opportunity.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
              {opportunity.name || "Nome do Curso Indisponível"}
            </h1>
            <div className="flex flex-wrap items-center text-sm text-slate-500 mb-6 gap-x-4 gap-y-1">
              <div className="flex items-center">
                <BuildingOfficeIcon />
                <span className="ml-1">
                  {institution.name || "Instituição não informada"}
                </span>
              </div>
              {opportunity.shift && (
                <div className="flex items-center">
                  <ClockIcon />
                  <span className="ml-1">{opportunity.shift}</span>
                </div>
              )}
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
              <h2 className="text-xl font-semibold text-slate-800 mb-2 border-b border-slate-200 pb-2">
                Sobre o Curso
              </h2>
              <p>
                {opportunity.description ||
                  "Nenhuma descrição detalhada fornecida para este curso. Entre em contato com a instituição para mais informações."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8 sticky top-24">
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-1">
                Sua Oportunidade Edupass
              </h2>
              {Number(opportunity.percentageScholarship) > 0 && (
                <div className="flex items-center text-sm text-[#F15050] font-semibold my-3">
                  <TagIcon />
                  <span className="ml-1.5">
                    Bolsa de {opportunity.percentageScholarship}% disponível!
                  </span>
                </div>
              )}
              {Number(opportunity.originalValue) > 0 && (
                <p className="text-sm text-slate-500 line-through">
                  Mensalidade:{" "}
                  {Number(opportunity.originalValue).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              )}
              {Number(opportunity.discountValue) > 0 && (
                <p className="text-3xl font-bold text-[#30ADE7] my-1">
                  {Number(opportunity.discountValue).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  <span className="text-base font-normal text-slate-600">
                    {" "}
                    /mês com bolsa
                  </span>
                </p>
              )}
              {opportunity.discountEntrance > 0 && (
                <p className="text-sm text-slate-600 mb-5">
                  + Matrícula com desconto:{" "}
                  {Number(opportunity.discountEntrance).toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )}
                </p>
              )}

              <button
                onClick={handleInscricaoClick}
                className="btn bg-[#30ADE7] text-white cursor-pointer w-full text-base py-3 mt-4 shadow-lg hover:shadow-xl"
              >
                Quero esta Bolsa!
              </button>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Ao clicar, você será direcionado para o formulário de inscrição.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Onde você vai estudar?
              </h3>
              {institution.urlImage && (
                <div className="w-full h-20 bg-slate-50 rounded-md flex items-center justify-center mb-4 overflow-hidden p-1">
                  <img
                    src={institution.urlImage}
                    alt={`Logo ${institution.name}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <p className="font-medium text-slate-700">
                {institution.name || "Nome da Instituição"}
              </p>
              <div className="text-sm text-slate-600 mt-1.5 space-y-1">
                <div className="flex items-start">
                  <MapPinIcon />
                  <span className="ml-1.5">
                    {fullAddress || "Endereço não informado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
