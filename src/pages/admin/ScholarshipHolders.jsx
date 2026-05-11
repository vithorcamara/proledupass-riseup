// src/pages/admin/ScholarshipHolders.jsx
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

const NoScholarshipHoldersIcon = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
         <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 4.5-7.5-4.5" />
    </svg>
);


export default function ScholarshipHolders() {
  const [allBolsistas, setAllBolsistas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
    fetchBolsistas();
  }, []);

  const fetchBolsistas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/scholarship-holders"); 
      setAllBolsistas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao buscar bolsistas:", err);
      setError("Falha ao carregar bolsistas. Tente novamente mais tarde.");
      setAllBolsistas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bolsistaId) => {
      setIsLoading(true); 
      setError(null);
      try {
        await axiosInstance.delete(`/scholarship-holders/${bolsistaId}`);
        fetchBolsistas();

        setMessageModalProps({
        title: "bolsista excluído",
        message: "O bolsista foi excluído com sucesso.",
        success: true,
      });
      setIsMessageModalOpen(true);
      } catch (err) {
        console.error("Erro ao excluir bolsista:", err.response?.data || err.message);
        const apiError = err.response?.data?.message || "Falha ao excluir bolsista.";
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

  const confirmarCancelamento = (bolsistaId) => {
    confirmarAcao({
      title: "Tem certeza que deseja excluir este bolsista?",
      message: "Esta ação pode afetar inscrições associadas e não pode ser desfeita.",
      onConfirm: () => handleDelete(bolsistaId),
    });
  };

  const filteredBolsistas = useMemo(() => {
    if (!searchTerm.trim()) {
      return allBolsistas;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    // const searchTermDigits = searchTerm.replace(/\D/g, '');

    const filtered = allBolsistas.filter(bolsista => {
      return bolsista.fullName?.toLowerCase().includes(lowerSearchTerm);
    });
    // console.log("Resultado filtrado:", filtered);
    return filtered;

    // return allBolsistas.filter(bolsista => {
    //   const fullNameMatch = bolsista.fullName && bolsista.fullName.toLowerCase().includes(lowerSearchTerm);
    //   const bolsistaCpfMatch = bolsista.cpf && bolsista.cpf.replace(/\D/g, '').includes(searchTermDigits);
    //   const customerCpfMatch = bolsista.customers?.cpf && bolsista.customers.cpf.replace(/\D/g, '').includes(searchTermDigits);
      
    //   return fullNameMatch || bolsistaCpfMatch || customerCpfMatch;
    // });
  }, [allBolsistas, searchTerm]);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Gerenciar Bolsistas
        </h1>
        <Link
          to="/admin/scholarship-holders/new" 
          className="btn btn-primary inline-flex items-center w-full sm:w-auto justify-center"
        >
          <PlusIcon />
          Adicionar Bolsista
        </Link>
      </header>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="relative max-w-lg"> {/* Limita a largura da barra de busca */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar pelo do Bolsista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full" // Usa classe global .form-input
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {isLoading && filteredBolsistas.length === 0 && <p className="p-8 text-center text-gray-500">Carregando bolsistas...</p>}
        {!isLoading && filteredBolsistas.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500">
            <NoScholarshipHoldersIcon />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchTerm ? "Nenhum bolsista encontrado." : "Nenhum bolsista cadastrado"}
            </h3>
            {!searchTerm && <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo bolsista.</p>}
          </div>
        )}
        
        {filteredBolsistas.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th-admin">Nome Completo</th>
                  <th className="th-admin hidden md:table-cell">CPF (Bolsista)</th>
                  <th className="th-admin hidden sm:table-cell">Email (Cliente)</th>
                  <th className="th-admin hidden lg:table-cell">Necessidades</th>
                  <th className="th-admin text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBolsistas.map(bolsista => (
                  <tr key={bolsista.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="td-admin font-medium text-gray-900">{bolsista.fullName || <span className="italic text-gray-400">Não informado</span>}</td>
                    <td className="td-admin hidden md:table-cell">{bolsista.cpf || <span className="italic text-gray-400">Não informado</span>}</td>
                    <td className="td-admin hidden sm:table-cell">{bolsista.customers?.email || <span className="italic text-gray-400">Não associado</span>}</td>
                    <td className="td-admin hidden lg:table-cell">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${bolsista.needs ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                        {bolsista.needs ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="td-admin text-right pr-6 space-x-1 sm:space-x-3 whitespace-nowrap">
                      <button 
                        onClick={() => navigate(`/admin/scholarship-holders/edit/${bolsista.id}`)} 
                        className="p-1.5 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-md transition-colors"
                        title="Editar Bolsista"
                        disabled={isLoading}
                      >
                        <EditIcon />
                      </button>
                      <button 
                        onClick={() => confirmarCancelamento(bolsista.id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                        title="Excluir Bolsista"
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
         {filteredBolsistas.length > 0 && <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">Exibindo {filteredBolsistas.length} de {allBolsistas.length} bolsista(s)</div>}
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

