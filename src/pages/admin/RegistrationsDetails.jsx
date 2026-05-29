// src/pages/admin/InscriptionDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import { ArrowLeft, CheckCircle, XCircle, Clock, Archive } from "lucide-react";

const BackArrowIcon = () => <ArrowLeft className="w-5 h-5 mr-2" />;
const CheckCircleIcon = () => (
  <CheckCircle className="w-5 h-5 text-green-600" />
);
const XCircleIcon = () => <XCircle className="w-5 h-5 text-red-600" />;
const ClockIcon = () => <Clock className="w-5 h-5 text-yellow-500" />;
const ArchiveBoxIcon = () => <Archive className="w-5 h-5 text-gray-500" />;

const StatusBar = ({ status }) => {
  let progressColor = "bg-gray-400";
  let bgColor = "bg-gray-200";
  let textColor = "text-gray-700";
  let widthPercent = "0%";
  let IconComponent = ArchiveBoxIcon;
  let statusLabel = status || "Desconhecido";
  if (status) {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "matriculado") {
      progressColor = "bg-green-500";
      textColor = "text-green-700";
      widthPercent = "100%";
      IconComponent = CheckCircleIcon;
      statusLabel = "Matriculado";
    } else if (lowerStatus === "pendente") {
      progressColor = "bg-yellow-400";
      textColor = "text-yellow-700";
      widthPercent = "50%";
      IconComponent = ClockIcon;
      statusLabel = "Aguardando Vaga";
    } else if (lowerStatus === "cancelado") {
      progressColor = "bg-red-500";
      textColor = "text-red-700";
      widthPercent = "100%";
      IconComponent = XCircleIcon;
      statusLabel = "Cancelado";
    } else if (lowerStatus === "concluido") {
      progressColor = "bg-green-500";
      textColor = "text-green-700";
      widthPercent = "100%";
      IconComponent = CheckCircleIcon;
      statusLabel = "Concluido";
    }
  }
  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-center mb-1">
        <IconComponent />
        <span className={`ml-2 text-sm font-medium ${textColor}`}>
          {statusLabel}
        </span>
      </div>
      <div className={`h-2 w-full rounded-full ${bgColor} overflow-hidden`}>
        <div
          className={`h-2 rounded-full ${progressColor} transition-all duration-500 ease-out`}
          style={{ width: widthPercent }}
        ></div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {value || <span className="italic text-gray-400">Não informado</span>}
    </dd>
  </div>
);

export default function RegistrationsDetails() {
  const [inscription, setInscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: inscriptionId } = useParams();

  useEffect(() => {
    if (inscriptionId) {
      setIsLoading(true);
      setError(null);
      axiosInstance
        .get(`/registrations/${inscriptionId}`)
        .then((res) => {
          console.log("📌 Dados da inscrição recebidos:", res.data);
          setInscription(res.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar detalhes da inscrição:", err);
          setError("Não foi possível carregar os detalhes da inscrição.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [inscriptionId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const parts = dateString.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando detalhes da inscrição...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <Link
          to="/admin/registrations"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <BackArrowIcon /> Voltar para Lista
        </Link>
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow"
          role="alert"
        >
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!inscription) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <Link
          to="/admin/registrations"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <BackArrowIcon /> Voltar para Lista
        </Link>
        <p className="text-center text-gray-500">
          Detalhes da inscrição não encontrados.
        </p>
      </div>
    );
  }

  const {
    scholarshipHolders: bolsista,
    courses: curso,
    registrationDate,
    status,
  } = inscription;

  const rotaVoltar =
    String(status?.status || "").toLowerCase() === "pendente"
      ? "/admin/WaitList"
      : "/admin/registrations";

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Detalhes da Inscrição #{inscription.id}
        </h1>
        <Link
          to={rotaVoltar}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <BackArrowIcon />
          Voltar para Lista
        </Link>
      </header>

      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Seção de Status */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
            Status da Inscrição
          </h3>
          <StatusBar status={status.status} />
        </div>

        {/* Detalhes do Bolsista */}
        {bolsista && (
          <div className="border-t border-gray-200 px-6 py-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3">
              Informações do Bolsista
            </h3>
            <dl className="divide-y divide-gray-200">
              <DetailItem label="Nome Completo" value={bolsista.fullName} />
              <DetailItem label="CPF (Bolsista)" value={bolsista.cpf} />
              <DetailItem
                label="Data de Nascimento"
                value={formatDate(bolsista.dateOfBirth)}
              />
              <DetailItem
                label="Necessidades Especiais"
                value={bolsista.needs ? "Sim" : "Não"}
              />
              <DetailItem label="Raça/Cor" value={bolsista.raceColor} />
              {bolsista.customers && (
                <>
                  <DetailItem
                    label="Email do Cliente"
                    value={bolsista.customers.email}
                  />
                  <DetailItem
                    label="Telefone do Cliente"
                    value={bolsista.customers.phone}
                  />
                  <DetailItem
                    label="CPF do Cliente"
                    value={bolsista.customers.cpf}
                  />
                </>
              )}
            </dl>
          </div>
        )}

        {/* Detalhes do Curso e Instituição */}
        {curso && (
          <div className="border-t border-gray-200 px-6 py-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3">
              Informações do Curso
            </h3>
            <dl className="divide-y divide-gray-200">
              <DetailItem label="Nome do Curso" value={curso.name} />
              <DetailItem label="Turno" value={curso.shift} />
              <DetailItem label="Vagas" value={curso.vacancies?.toString()} />
              <DetailItem
                label="Bolsa"
                value={
                  curso.percentageScholarship
                    ? `${curso.percentageScholarship}%`
                    : "N/A"
                }
              />
              <DetailItem
                label="Valor Original"
                value={
                  curso.originalValue
                    ? `R$ ${Number(curso.originalValue).toFixed(2)}`
                    : "N/A"
                }
              />
              <DetailItem
                label="Valor com Desconto"
                value={
                  curso.discountValue
                    ? `R$ ${Number(curso.discountValue).toFixed(2)}`
                    : "N/A"
                }
              />
              {curso.institutions && (
                <DetailItem
                  label="Instituição"
                  value={curso.institutions.name}
                />
              )}
            </dl>
          </div>
        )}

        {/* Detalhes da Inscrição */}
        <div className="border-t border-gray-200 px-6 py-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3">
            Detalhes Adicionais da Inscrição
          </h3>
          <dl className="divide-y divide-gray-200">
            <DetailItem
              label="Data da Inscrição"
              value={formatDate(registrationDate)}
            />
          </dl>
        </div>
      </div>
    </div>
  );
}
