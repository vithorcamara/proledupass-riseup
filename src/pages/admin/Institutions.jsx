// src/pages/admin/Institutions.jsx
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import ConfirmModal from "../../components/ConfirmModal";
import MessageModal from "../../components/MessageModal";
import { Plus, Pencil, Trash2, University } from "lucide-react";

const PlusIcon = () => <Plus className="w-5 h-5 mr-2" />;
const EditIcon = () => <Pencil className="w-4 h-4" />;
const TrashIcon = () => <Trash2 className="w-4 h-4" />;

function FilterableSelect({ options, value, onChange, placeholder }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-64">
      <input
        type="text"
        value={isOpen ? search : value}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
      {isOpen && (
        <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-auto shadow-lg">
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-gray-500 text-sm">
              Nenhum resultado
            </li>
          ) : (
            filteredOptions.map((opt) => (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setSearch(opt);
                  setIsOpen(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm"
              >
                {opt}
              </li>
            ))
          )}
          {value && (
            <li
              onClick={() => {
                onChange("");
                setSearch("");
                setIsOpen(false);
              }}
              className="px-3 py-2 text-gray-500 text-sm cursor-pointer hover:bg-gray-100 border-t"
            >
              Limpar seleção
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default function Institutions() {
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // filtros
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  // modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState(() => () => {});
  const [modalProps, setModalProps] = useState({
    title: "Tem certeza?",
    message: "Você deseja realmente continuar?",
  });
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalProps, setMessageModalProps] = useState({
    title: "",
    message: "",
    success: true,
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/institutions");
      setInstitutions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao buscar instituições:", err);
      setError("Falha ao carregar instituições. Tente novamente mais tarde.");
      setInstitutions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/institutions/${id}`);
      await fetchInstitutions();
      setMessageModalProps({
        title: "Instituição excluída",
        message: "A instituição foi excluída com sucesso.",
        success: true,
      });
      setIsMessageModalOpen(true);
    } catch (err) {
      console.error(
        "Erro ao excluir instituição:",
        err.response?.data || err.message,
      );
      const apiError =
        err.response?.data?.message || `Falha ao excluir instituição.`;
      setMessageModalProps({
        title: "Erro ao excluir",
        message: apiError,
        success: false,
      });
      setIsMessageModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarAcao = ({ onConfirm, title, message }) => {
    setModalProps({
      title: title || "Tem certeza?",
      message: message || "Você deseja realmente continuar?",
    });
    setOnConfirmCallback(() => onConfirm);
    setIsModalOpen(true);
  };

  const confirmarCancelamento = (id) => {
    confirmarAcao({
      title: "Tem certeza que deseja excluir esta instituição?",
      message: "Esta ação não pode ser desfeita.",
      onConfirm: () => handleDelete(id),
    });
  };

  // filtros
  const filteredInstitutions = institutions.filter((inst) => {
    // Nome Fantasia filter
    if (filterName) {
      const nome = (inst.nomeFantasia || inst.name || "").toLowerCase();
      if (!nome.includes(filterName.toLowerCase())) return false;
    }

    // Type filter
    if (filterType && inst.type !== filterType) return false;

    // City filter
    if (filterCity) {
      const cityState = `${inst.city || ""}/${inst.state || ""}`;
      if (cityState !== filterCity) return false;
    }

    // Status filter
    if (filterStatus) {
      const statusBool = filterStatus === "true";
      if (inst.status !== statusBool) return false;
    }

    return true;
  });

  // opções para selects
  const availableNames = [
    ...new Set(
      institutions.map((i) => i.nomeFantasia || i.name || "").filter(Boolean),
    ),
  ];
  const availableTypes = [
    ...new Set(institutions.map((i) => i.type).filter(Boolean)),
  ];
  const availableCities = [
    ...new Set(
      institutions
        .map((i) => `${i.city || ""}/${i.state || ""}`)
        .filter(Boolean),
    ),
  ];

  const visibleInstitutions = filteredInstitutions
    .sort((a, b) => (a.status === b.status ? 0 : a.status ? -1 : 1))
    .slice(0, 50);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <University className="w-7 h-7 text-blue-600" />
            Instituições
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie instituições cadastradas e suas informações
          </p>
        </div>

        <Link
          to="/admin/institutions/new"
          className="mt-4 sm:mt-0 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
        >
          <PlusIcon />
          Nova Instituição
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <FilterableSelect
            options={availableNames}
            value={filterName}
            onChange={setFilterName}
            placeholder="Buscar Nome Fantasia..."
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">Todos os Tipos</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">Todas as Cidades/UF</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">Todos os Status</option>
            <option value="true">Ativas</option>
            <option value="false">Inativas</option>
          </select>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {isLoading && institutions.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            Carregando instituições...
          </p>
        )}

        {!isLoading && visibleInstitutions.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500">
            Nenhuma instituição encontrada
          </div>
        )}

        {visibleInstitutions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="px-6 py-3">Nome Fantasia</th>
                  <th className="px-6 py-3 hidden md:table-cell">
                    Responsável
                  </th>
                  <th className="px-6 py-3 hidden sm:table-cell">Email</th>
                  <th className="px-6 py-3 hidden lg:table-cell">CNPJ</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Cidade/UF</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visibleInstitutions.map((inst) => (
                  <tr
                    key={inst.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {inst.nomeFantasia || inst.name || "—"}
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell text-gray-700">
                      {inst.respNome ||
                        inst.nameResponsible ||
                        inst.responsavel ||
                        "—"}
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell text-gray-700">
                      {inst.respEmail || inst.emailResponsible || "—"}
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell text-gray-700">
                      {inst.cnpj || "—"}
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell text-gray-700">
                      {(inst.city || "—") +
                        (inst.state ? ` / ${inst.state}` : "")}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          inst.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {inst.status ? "Ativa" : "Inativa"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/institutions/edit/${inst.id}`)
                          }
                          className="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-600 transition"
                          title="Editar"
                          disabled={isLoading}
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => confirmarCancelamento(inst.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                          title="Excluir"
                          disabled={isLoading}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {visibleInstitutions.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Exibindo {visibleInstitutions.length} de {institutions.length}{" "}
            instituições
          </div>
        )}
      </div>

      {/* Modais */}
      <ConfirmModal
        isOpen={isModalOpen}
        title={modalProps.title}
        message={modalProps.message}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          if (onConfirmCallback) onConfirmCallback();
          setIsModalOpen(false);
        }}
      />

      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title={messageModalProps.title}
        message={messageModalProps.message}
        success={messageModalProps.success}
      />
    </div>
  );
}
