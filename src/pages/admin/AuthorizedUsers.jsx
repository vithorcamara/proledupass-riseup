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

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
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
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/AuthorizedUsers");
      setAllUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erro ao buscar usuários Autorizados:", err);
      setError(
        "Falha ao carregar usuários Autorizados. Tente novamente mais tarde.",
      );
      setAllUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/AuthorizedUsers/${userId}`);
      fetchUsers();

      setMessageModalProps({
        title: "Usuário excluído",
        message: "O usuário foi excluído com sucesso.",
        success: true,
      });
    } catch (err) {
      console.error(
        "Erro ao excluir usuário:",
        err.response?.data || err.message,
      );

      const apiError =
        err.response?.data?.message || "Falha ao excluir usuário.";
      let customMessage = apiError;

      // Verifica se o erro é de chave estrangeira
      if (
        apiError.toLowerCase().includes("constraint") ||
        apiError.toLowerCase().includes("foreign key") ||
        apiError.toLowerCase().includes("violates") ||
        apiError.toLowerCase().includes("integrity")
      ) {
        customMessage =
          "Não é possível excluir este usuário pois ele está vinculado a um bolsista. Remova o vínculo antes de tentar novamente.";
      }

      setMessageModalProps({
        title: "Erro ao excluir",
        message: customMessage,
        success: false,
      });
    } finally {
      setIsMessageModalOpen(true);
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

  const confirmarCancelamento = (userId) => {
    confirmarAcao({
      title: "Tem certeza que deseja excluir esta inscrição?",
      message: "Esta ação não pode ser desfeita.",
      onConfirm: () => handleDelete(userId),
    });
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return allUsers;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    // const searchTermDigits = searchTerm.replace(/\D/g, '');

    const filtered = allUsers.filter((user) => {
      return user.name?.toLowerCase().includes(lowerSearchTerm);
    });
    // console.log("Resultado filtrado:", filtered);
    return filtered;

    // return allUsers.filter(user => {
    //   const nameMatch = user.fullName ? user.fullName.toLowerCase().includes(lowerSearchTerm) : false;
    //   const emailMatch = user.email ? user.email.toLowerCase().includes(lowerSearchTerm) : false; // Adicionada verificação se user.email existe
    //   const cpfMatch = user.cpf ? user.cpf.replace(/\D/g, '').includes(searchTermDigits) : false;

    //   return nameMatch || emailMatch || cpfMatch;
    // });
  }, [allUsers, searchTerm]);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Gerenciar Clientes Autorizados
        </h1>
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

      <div className="mb-6 flex items-center justify-between">
        <div className="relative max-w-lg w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar pelo nome do usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
        <Link
          to="/admin/AuthorizedUsers/new"
          className="btn btn-primary inline-flex items-center justify-center ml-4"
        >
          <PlusIcon className="mr-2" />
          Adicionar Autorizados
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {isLoading && filteredUsers.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            Carregando usuários...
          </p>
        )}
        {!isLoading && filteredUsers.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500">
            <NoUsersIcon />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {searchTerm
                ? "Nenhum usuário encontrado."
                : "Nenhum usuário cadastrado"}
            </h3>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th-admin">ID</th>
                  <th className="th-admin">Nome / Email</th>
                  <th className="th-admin hidden md:table-cell">TELEFONE</th>
                  <th className="th-admin hidden md:table-cell">CPF</th>
                  <th className="th-admin hidden md:table-cell">RG</th>
                  {/* <th className="th-admin hidden lg:table-cell">Roles</th> */}
                  <th className="th-admin text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="td-admin font-mono text-xs">{user.id}</td>
                    <td className="td-admin font-medium text-gray-900">
                      {user.name || user.email || "N/A"}
                      {user.name && user.email && (
                        <span className="block text-xs text-gray-500">
                          {user.email}
                        </span>
                      )}
                    </td>
                    <td className="td-admin hidden md:table-cell">
                      {user.phone || (
                        <span className="italic text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="td-admin hidden md:table-cell">
                      {user.cpf || (
                        <span className="italic text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="td-admin hidden md:table-cell">
                      {user.rg || (
                        <span className="italic text-gray-400">N/A</span>
                      )}
                    </td>
                    {/* <td className="td-admin hidden lg:table-cell">
                      {user.roles && user.roles.length > 0
                        ? user.roles.map(role => typeof role === 'object' ? role.type : role).join(', ')
                        : <span className="italic text-gray-400">Nenhuma</span>
                      }
                    </td> */}
                    <td className="td-admin text-right pr-6 space-x-1 sm:space-x-3 whitespace-nowrap">
                      <button
                        onClick={() =>
                          navigate(`/admin/AuthorizedUsers/edit/${user.id}`)
                        } // Descomente se UserForm.jsx existir
                        className="p-1.5 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-md transition-colors"
                        title="Editar Usuário"
                        disabled={isLoading} // Ou um loading específico para a ação
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => confirmarCancelamento(user.id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                        title="Excluir Usuário"
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
        {filteredUsers.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
            Exibindo {filteredUsers.length} de {allUsers.length} usuário(s)
            Autorizado(s)
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
