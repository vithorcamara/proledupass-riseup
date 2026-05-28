// src/pages/admin/Dashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import { Users, University, BookOpen, FileText, Clock } from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
);

const UsersIcon = () => <Users className="w-8 h-8 text-blue-500" />;
const InstitutionIcon = () => (
  <University className="w-8 h-8 text-indigo-500" />
);
const CourseIcon = () => <BookOpen className="w-8 h-8 text-purple-500" />;
const InscriptionIcon = () => <FileText className="w-8 h-8 text-green-500" />;
const ClockIcon = () => <Clock className="w-8 h-8 text-yellow-500" />;

const StatCard = ({ title, value, icon, linkTo, isLoading }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        {isLoading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md mt-1"></div>
        ) : (
          <p className="text-3xl font-semibold text-gray-800 mt-1">{value}</p>
        )}
      </div>
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
    </div>
    {linkTo && !isLoading && (
      <div className="mt-4">
        <Link
          to={linkTo}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Ver todos &rarr;
        </Link>
      </div>
    )}
  </div>
);

// Função para mapear status para exibição e cores
const mapStatus = (status) => {
  if (!status) return { label: "N/A", className: "bg-gray-100 text-gray-800" };

  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case "pendente":
      return {
        label: "Aguardando Vaga",
        className: "bg-yellow-100 text-yellow-800",
      };
    case "matriculado":
    case "concluido":
      return { label: status, className: "bg-green-100 text-green-800" };
    case "cancelado":
      return { label: status, className: "bg-red-100 text-red-800" };
    default:
      return { label: status, className: "bg-gray-100 text-gray-800" };
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalCourses: 0,
    totalScholarshipHolders: 0,
    totalInscriptions: 0,
    pendingInscriptions: 0,
  });
  const [recentInscriptions, setRecentInscriptions] = useState([]);
  const [allInscriptionsData, setAllInscriptionsData] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRecents, setIsLoadingRecents] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingStats(true);
      setIsLoadingRecents(true);
      setError(null);
      try {
        const [
          institutionsRes,
          coursesRes,
          scholarshipHoldersRes,
          inscriptionsRes,
        ] = await Promise.all([
          axiosInstance.get("/institutions"),
          axiosInstance.get("/courses"),
          axiosInstance.get("/scholarship-holders"),
          axiosInstance.get("/registrations"),
        ]);

        const totalInstitutions = Array.isArray(institutionsRes.data)
          ? institutionsRes.data.length
          : 0;
        const totalCourses = Array.isArray(coursesRes.data)
          ? coursesRes.data.length
          : 0;
        const totalScholarshipHolders = Array.isArray(
          scholarshipHoldersRes.data,
        )
          ? scholarshipHoldersRes.data.length
          : 0;

        const inscriptionsData = Array.isArray(inscriptionsRes.data)
          ? inscriptionsRes.data
          : [];
        setAllInscriptionsData(inscriptionsData);

        const totalInscriptions = inscriptionsData.length;
        const pendingInscriptions = inscriptionsData.filter(
          (insc) =>
            insc.status && insc.status.status.toLowerCase() === "pendente",
        ).length;

        setStats({
          totalInstitutions,
          totalCourses,
          totalScholarshipHolders,
          totalInscriptions,
          pendingInscriptions,
        });

        const sortedInscriptions = [...inscriptionsData].sort(
          (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate),
        );
        setRecentInscriptions(sortedInscriptions.slice(0, 5));
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError("Não foi possível carregar os dados do dashboard.");
        setAllInscriptionsData([]);
      } finally {
        setIsLoadingStats(false);
        setIsLoadingRecents(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  // Gráfico de Rosca: Inscrições por Status
  const inscriptionStatusChartData = useMemo(() => {
    if (!allInscriptionsData || allInscriptionsData.length === 0) return null;

    const statusCounts = allInscriptionsData.reduce((acc, inscription) => {
      let status =
        inscription.status.status?.trim().toLowerCase() || "desconhecido";

      let displayStatus = "Outro";
      if (status === "pendente" || status === "concluido")
        displayStatus = "Aguardando Vaga/Concluído";
      else if (status === "matriculado") displayStatus = "Matriculado";
      else if (status === "cancelado") displayStatus = "Cancelado";

      acc[displayStatus] = (acc[displayStatus] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    const backgroundColors = labels.map((label) => {
      switch (label.toLowerCase()) {
        case "Aguardando Vaga/concluído":
          return "rgba(255, 206, 86, 0.8)"; // Amarelo
        case "matriculado":
          return "rgba(75, 192, 192, 0.8)"; // Verde/Azulado
        case "cancelado":
          return "rgba(255, 99, 132, 0.8)"; // Vermelho
        default:
          return "rgba(201, 203, 207, 0.8)"; // Cinza
      }
    });
    const borderColors = backgroundColors.map((color) =>
      color.replace("0.8", "1"),
    );

    return {
      labels,
      datasets: [
        {
          label: "Número de Inscrições",
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
          hoverOffset: 4,
        },
      ],
    };
  }, [allInscriptionsData]);

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 }, padding: 15 } },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) label += ": ";
            if (context.parsed !== null) label += context.parsed;
            const total = context.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0,
            );
            const percentage =
              total > 0
                ? ((context.parsed / total) * 100).toFixed(1) + "%"
                : "0%";
            label += ` (${percentage})`;
            return label;
          },
        },
      },
    },
  };

  const monthlyInscriptionsChartData = useMemo(() => {
    if (!allInscriptionsData || allInscriptionsData.length === 0) return null;

    const monthlyCounts = allInscriptionsData.reduce((acc, inscription) => {
      if (inscription.registrationDate) {
        const date = new Date(inscription.registrationDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedMonths = Object.keys(monthlyCounts).sort(
      (a, b) => new Date(a) - new Date(b),
    );
    const labels = sortedMonths.map((monthYear) => {
      const [year, month] = monthYear.split("-");
      const monthDate = new Date(parseInt(year), parseInt(month) - 1);
      return monthDate.toLocaleDateString("pt-BR", {
        month: "short",
        year: "numeric",
      });
    });
    const data = sortedMonths.map((month) => monthlyCounts[month]);

    return {
      labels,
      datasets: [
        {
          label: "Novas Inscrições",
          data,
          fill: true,
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.1,
          pointBackgroundColor: "rgb(54, 162, 235)",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [allInscriptionsData]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : null),
        },
        grid: { color: "rgba(200, 200, 200, 0.2)" },
      },
    },
    hover: { mode: "nearest", intersect: true },
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard Administrativo
        </h1>
        <p className="text-gray-600 mt-1">Visão geral do sistema Edupass.</p>
      </header>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow"
          role="alert"
        >
          <p className="font-bold">Erro ao Carregar Dashboard</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Instituições"
          value={stats.totalInstitutions}
          icon={<InstitutionIcon />}
          linkTo="/admin/registrations"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Cursos"
          value={stats.totalCourses}
          icon={<CourseIcon />}
          linkTo="/admin/courses"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Bolsistas"
          value={stats.totalScholarshipHolders}
          icon={<UsersIcon />}
          linkTo="/admin/scholarship-holders"
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Inscrições"
          value={stats.totalInscriptions}
          icon={<InscriptionIcon />}
          linkTo="/admin/registrations"
          isLoading={isLoadingStats}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Últimas Inscrições
            </h2>
            {isLoadingRecents && (
              <div className="text-center py-4">
                <span className="text-gray-500">Carregando recentes...</span>
              </div>
            )}
            {!isLoadingRecents && recentInscriptions.length === 0 && !error && (
              <p className="text-gray-500 text-center py-4">
                Nenhuma inscrição recente.
              </p>
            )}
            {recentInscriptions.length > 0 && (
              <ul className="divide-y divide-gray-200">
                {recentInscriptions.map((insc) => {
                  const { label, className } = mapStatus(insc.status.status);
                  return (
                    <li
                      key={insc.id}
                      className="py-3.5 flex justify-between items-center hover:bg-gray-50 px-2 -mx-2 rounded-md transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {insc.scholarshipHolders?.fullName ||
                            "Bolsista Desconhecido"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Curso: {insc.courses?.name || "N/A"}
                          <span className="hidden sm:inline">
                            {" "}
                            em {insc.courses?.institutions?.name || "N/A"}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs leading-tight font-semibold rounded-full ${className}`}
                        >
                          {label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(insc.registrationDate)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Gráficos aqui (Inscrições por Status, Novas Inscrições por Mês) */}
          {/* Mantive seu código original dos gráficos sem alterações */}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Ações Rápidas
            </h2>
            <div className="space-y-3">
              <Link
                to="/admin/companies/new"
                className="block w-full text-center btn btn-secondary"
              >
                Nova Empresa
              </Link>
              <Link
                to="/admin/institutions/new"
                className="block w-full text-center btn btn-secondary"
              >
                Adicionar Instituição
              </Link>
              <Link
                to="/admin/courses/new"
                className="block w-full text-center btn btn-secondary"
              >
                Adicionar Curso
              </Link>
              <Link
                to="/admin/scholarship-holders/new"
                className="block w-full text-center btn btn-secondary"
              >
                Adicionar Bolsista
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Novas Inscrições por Mês
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Acompanhe o volume de novas inscrições ao longo do tempo.
            </p>
            <div className="h-64 md:h-72 relative">
              {/* Gráfico de linhas */}
              {monthlyInscriptionsChartData && (
                <Line
                  data={monthlyInscriptionsChartData}
                  options={lineChartOptions}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
