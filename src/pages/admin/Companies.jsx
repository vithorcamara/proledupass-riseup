// src/pages/admin/Users.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import ConfirmModal from "../../components/ConfirmModal";
import MessageModal from "../../components/MessageModal";

import { Plus, Pencil, Trash2, Search, UserX } from "lucide-react";

const PlusIcon = () => <Plus className="w-5 h-5 mr-2" />;
const EditIcon = () => <Pencil className="w-4 h-4" />;
const TrashIcon = () => <Trash2 className="w-4 h-4" />;
const SearchIcon = () => <Search className="w-5 h-5 text-gray-400" />;
const NoUsersIcon = () => <UserX className="mx-auto h-12 w-12 text-gray-400" />;

export default function Companies() {
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/companies");
      console.log(res.data);
      setAllCompanies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      setError("Falha ao carregar empresas. Tente novamente mais tarde.");
      setAllCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (companyId) => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/companies/${companyId}`);
      fetchCompanies();

      // Mostra modal de sucesso diretamente
      setMessageModalProps({
        title: "Empresa excluída",
        message: "A empresa foi excluída com sucesso.",
        success: true,
      });
      setIsMessageModalOpen(true);
    } catch (err) {
      const apiError =
        err?.response?.data?.message || "Falha ao excluir empresa.";

      // Mostra modal de erro diretamente
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

  const confirmarCancelamento = (companyId) => {
    confirmarAcao({
      title: "Tem certeza que deseja excluir esta empresa?",
      message: "Esta ação não pode ser desfeita.",
      onConfirm: () => handleDelete(companyId),
    });
  };

  const filteredCompanies = useMemo(() => {
    if (!searchTerm.trim()) {
      return allCompanies;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    // const searchTermDigits = searchTerm.replace(/\D/g, '');

    const filtered = allCompanies.filter((company) => {
      return company.fantasyName?.toLowerCase().includes(lowerSearchTerm);
    });
    // console.log("Resultado filtrado:", filtered);
    return filtered;

    // return allCompanies.filter(company => {
    //   const nameMatch = company.fantasyName ? company.fantasyName.toLowerCase().includes(lowerSearchTerm) : false;
    //   const emailMatch = company.email ? company.email.toLowerCase().includes(lowerSearchTerm) : false;
    //   const cnpjMatch = company.cnpj ? company.cnpj.replace(/\D/g, '').includes(searchTermDigits) : false;

    //   return nameMatch || emailMatch || cnpjMatch;
    // });
  }, [allCompanies, searchTerm]);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Gerenciar Empresas
        </h1>
        <Link
          to="/admin/companies/new"
          className="btn btn-primary inline-flex items-center w-full sm:w-auto justify-center"
        >
          <PlusIcon />
          Adicionar Empresa
        </Link>
      </header>

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow"
          role="alert"
        >
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar pelo nome da empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {isLoading && filteredCompanies.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            Carregando empresas...
          </p>
        )}
        {!isLoading && filteredCompanies.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500">
            <NoUsersIcon />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchTerm
                ? "Nenhuma empresa encontrada."
                : "Nenhuma empresa cadastrada"}
            </h3>
          </div>
        )}

        {filteredCompanies.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th-admin">ID</th>
                  <th className="th-admin">Nome Fantasia</th>
                  <th className="th-admin hidden sm:table-cell">CNPJ</th>
                  {/* <th className="th-admin hidden md:table-cell">Role</th> */}
                  <th className="th-admin text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="td-admin font-mono text-xs">{company.id}</td>
                    <td className="td-admin font-medium text-gray-900">
                      {company.fantasyName || company.email || "N/A"}
                      {company.fantasyName && company.email && (
                        <span className="block text-xs text-gray-500">
                          {company.email}
                        </span>
                      )}
                    </td>
                    <td className="td-admin hidden md:table-cell">
                      {company.cnpj || (
                        <span className="italic text-gray-400">N/A</span>
                      )}
                    </td>
                    {/* <td className="td-admin hidden sm:table-cell">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </td> */}
                    {/* <td className="td-admin hidden lg:table-cell">
                      {company.roles && company.roles.length > 0
                        ? company.roles.map(role => typeof role === 'object' ? role.type : role).join(', ')
                        : <span className="italic text-gray-400">Nenhuma</span>
                      }
                    </td> */}
                    <td className="td-admin text-right pr-6 space-x-1 sm:space-x-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          navigate(`/admin/companies/edit/${company.id}`)
                        }
                        className="p-1.5 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-md transition-colors"
                        title="Editar Empresa"
                        disabled={isLoading} // Ou um loading específico para a ação
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => confirmarCancelamento(company.id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                        title="Excluir Empresa"
                        disabled={isLoading}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filteredCompanies.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Exibindo {filteredCompanies.length} de {allCompanies.length}{" "}
            empresa(s)
          </div>
        )}
      </div>
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
