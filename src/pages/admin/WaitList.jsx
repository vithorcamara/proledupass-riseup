// src/pages/admin/Inscriptions.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import ConfirmModal from "../../components/ConfirmModal";
import MessageModal from "../../components/MessageModal";

import { CheckCircle, XCircle, Clock, Archive, Trash2, Eye } from "lucide-react";

const CheckCircleIcon = () => (
  <CheckCircle className="w-5 h-5 text-green-600" />
);
const XCircleIcon = () => (
  <XCircle className="w-5 h-5 text-red-600" />
);
const ClockIcon = () => (
  <Clock className="w-5 h-5 text-yellow-500" />
);
const ArchiveBoxIcon = () => (
  <Archive className="w-5 h-5 text-gray-500" />
);
const TrashIcon = () => (
  <Trash2 className="w-4 h-4" />
);
const EyeIcon = () => (
  <Eye className="w-4 h-4" />
);


const StatusBar = ({ status }) => {
  let progressColor = 'bg-gray-400';
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-700';
  let widthPercent = '0%';
  let IconComponent = ArchiveBoxIcon;
  let statusLabel = status || "Desconhecido";

  if (status) {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'matriculado') {
      progressColor = 'bg-green-500';
      textColor = 'text-green-700';
      widthPercent = '100%';
      IconComponent = CheckCircleIcon;
      statusLabel = "Matriculado";
    } else if (lowerStatus === 'pendente') {
      progressColor = 'bg-yellow-400';
      textColor = 'text-yellow-700';
      widthPercent = '50%';
      IconComponent = ClockIcon;
      statusLabel = "Aguardando Vaga";
    } else if (lowerStatus === 'cancelado') {
      progressColor = 'bg-red-500';
      textColor = 'text-red-700';
      widthPercent = '100%';
      IconComponent = XCircleIcon;
      statusLabel = "Cancelado";
    } else if (lowerStatus === 'concluido') {
      progressColor = 'bg-green-500';
      textColor = 'text-green-700';
      widthPercent = '100%';
      IconComponent = CheckCircleIcon;
      statusLabel = "Concluído";
    }
    // else if (lowerStatus === 'inativo') {
    //   progressColor = 'bg-orange-400';
    //   textColor = 'text-orange-700';
    //   widthPercent = '25%';
    //   IconComponent = ArchiveBoxIcon;
    //   statusLabel = "Inativo";
    // }
  }

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-center mb-1">
        <IconComponent />
        <span className={`ml-2 text-sm font-medium ${textColor}`}>{statusLabel}</span>
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


export default function Registrations() {
  const [inscriptions, setInscriptions] = useState([]);
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

  // precisa ser uma lista vinda da API;
  const allStatus = [
    { id: 1, status: "Aguardando Vaga" },
    { id: 2, status: "Matriculado" },
    { id: 3, status: "Concluido" },
    { id: 4, status: "Cancelado" }
  ];

  useEffect(() => {
    fetchInscriptions();
  }, []);

  const fetchInscriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/registrations");

      // garante que é array
      const allInscriptions = Array.isArray(res.data) ? res.data : [];

      // filtra só os que têm status "pendente"
      const pendingInscriptions = allInscriptions.filter(
        (insc) => insc.status?.status?.toLowerCase() === "pendente"
      );

      setInscriptions(pendingInscriptions);
    } catch (err) {
      console.error("Erro ao buscar inscrições no aguardando vagas:", err);
      setError("Falha ao carregar inscrições do aguardando vagas. Tente novamente mais tarde.");
      setInscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleStatusChange = async (inscriptionId, newStatus) => {
    const originalInscriptions = [...inscriptions];

    const inscriptionToUpdate = originalInscriptions.find(insc => insc.id === inscriptionId);

    if (!inscriptionToUpdate) {
      // console.error("Admin/Inscriptions: Inscrição não encontrada no estado para atualização. ID:", inscriptionId);
      alert("Não foi possível encontrar os dados da inscrição para atualizar.");
      return;
    }

    // console.log("Admin/Inscriptions: Dados da inscrição original:", JSON.stringify(inscriptionToUpdate, null, 2));

    setInscriptions(prevInscriptions =>
      prevInscriptions.map(insc =>
        insc.id === inscriptionId ? { ...insc, status: newStatus, _isUpdating: true } : insc
      )
    );

    try {

      const payload = {
        statusId: newStatus,
        scholarshipHolderId: inscriptionToUpdate.scholarshipHolders?.id,
        courseId: inscriptionToUpdate.courses?.id,
        registrationDate: inscriptionToUpdate.registrationDate
      };

      if (payload.scholarshipHolderId === undefined || payload.scholarshipHolderId === null) {
        throw new Error(`ID do Bolsista (scholarshipHolderId) é nulo ou indefinido para a inscrição ${inscriptionId}.`);
      }
      if (payload.courseId === undefined || payload.courseId === null) {
        throw new Error(`ID do Curso (courseId) é nulo ou indefinido para a inscrição ${inscriptionId}.`);
      }
      if (!payload.registrationDate) {
        throw new Error(`Data de Registro (registrationDate) está faltando para a inscrição ${inscriptionId}.`);
      }

      // console.log("Admin/Inscriptions: Atualizando inscrição ID:", inscriptionId, "Payload para PUT:", payload);
      await axiosInstance.put(`/registrations/${inscriptionId}`, payload);

      setInscriptions(prevInscriptions =>
        prevInscriptions.map(insc =>
          insc.id === inscriptionId ?
            {
              ...inscriptionToUpdate,
              status: allStatus.find(item => item.id == newStatus),
              _isUpdating: false
            } : insc
        )
      );
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (err) {
      console.error("Admin/Inscriptions: Erro ao atualizar status:", err.response?.data || err.message);
      const apiError = err.response?.data?.message || err.message || "Falha ao atualizar status da inscrição.";
      setError(apiError);
      alert(apiError);
      setInscriptions(originalInscriptions);
    }
  };

  const handleDeleteInscription = async (inscriptionId) => {
      setIsLoading(true);
      setError(null);
      try {
        await axiosInstance.delete(`/registrations/${inscriptionId}`);
        fetchInscriptions();

        setMessageModalProps({
        title: "Cadastro em aguardando vaga excluído",
        message: "O cadastro em aguardando vaga foi excluído com sucesso.",
        success: true,
      });
      setIsMessageModalOpen(true);
      } catch (err) {
        console.error("Erro ao excluir inscrição:", err.response?.data || err.message);
        const apiError = err.response?.data?.message || "Falha ao excluir inscrição.";
        setMessageModalProps({
        title: "Erro ao excluir",
        message: apiError,
        success: false,
      });
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

  const confirmarCancelamento = (inscriptionId) => {
    confirmarAcao({
      title: "Tem certeza que deseja remover este registro de aguardando vaga?",
      message: "Esta ação não pode ser desfeita.",
      onConfirm: () => handleDeleteInscription(inscriptionId),
    });
  };

  const handleSendEmail = async (customerId) => {
    try {
      console.log(customerId);
      const response = await axiosInstance.post(`/registrations/send-email/${customerId}`);
      alert(response.data);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      alert("Erro ao enviar o e-mail.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const parts = dateString.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateString;
    }
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-6 md:mb-8 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Aguardando Vagas
        </h1>
      </header>


      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
          <p className="font-bold">Erro</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {isLoading && inscriptions.length === 0 && <p className="p-8 text-center text-gray-500">Carregando inscrições...</p>}
        {!isLoading && inscriptions.length === 0 && !error && (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma inscrição encontrada</h3>
          </div>
        )}

        {inscriptions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="th-admin">ID</th>
                  <th className="th-admin">Bolsista</th>
                  <th className="th-admin hidden sm:table-cell">CPF Bolsista</th>
                  <th className="th-admin hidden md:table-cell">Curso</th>
                  <th className="th-admin hidden lg:table-cell">Instituição</th>
                  <th className="th-admin hidden xl:table-cell">Data Cadastro</th>
                  <th className="th-admin px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Status Atual</th>
                  <th className="th-admin text-center">Alterar Status</th>
                  <th className="th-admin text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inscriptions.map(insc => (
                  <tr key={insc.id} className={`hover:bg-gray-50 transition-colors duration-150 ${insc._isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                    <td className="td-admin font-mono text-xs">
                      <Link to={`/admin/registrations/${insc.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                        {insc.id}
                      </Link>
                    </td>
                    <td className="td-admin font-medium text-gray-900 truncate max-w-xs">
                      <Link to={`/admin/registrations/${insc.id}`} className="hover:underline" title={insc.scholarshipHolders?.fullName}>
                        {insc.scholarshipHolders?.fullName || "N/A"}
                      </Link>
                    </td>
                    <td className="td-admin hidden sm:table-cell">{insc.scholarshipHolders?.cpf || "N/A"}</td>
                    <td className="td-admin hidden md:table-cell truncate max-w-xs" title={insc.courses?.name}>{insc.courses?.name || "N/A"}</td>
                    <td className="td-admin hidden lg:table-cell truncate max-w-xs" title={insc.courses?.institutions?.name}>{insc.courses?.institutions?.name || "N/A"}</td>
                    <td className="td-admin hidden xl:table-cell">{formatDate(insc.registrationDate)}</td>
                    <td className="td-admin px-6 py-4 whitespace-nowrap">
                      <StatusBar status={insc.status.status} />
                    </td>
                    <td className="td-admin text-center px-6 py-4 whitespace-nowrap">
                      <select
                        value={insc.status.id || ''}
                        onChange={(e) => handleStatusChange(insc.id, e.target.value)}
                        className="form-select text-sm py-1 px-2 w-full max-w-[160px] mx-auto"
                        disabled={insc._isUpdating}
                      >
                        <option value="" disabled>Selecione o status...</option>
                        {allStatus.map(status => (
                          <option key={status.id} value={status.id}>{status.status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="td-admin text-right pr-6 space-x-1 sm:space-x-3 whitespace-nowrap">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                        onClick={() => handleSendEmail(insc.scholarshipHolders?.customers?.id)}
                      >
                        Enviar Email
                      </button>
                      <button
                        onClick={() => navigate(`/admin/registrations/${insc.id}`)}
                        className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                        title="Ver Detalhes"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => confirmarCancelamento(insc.id)}
                        className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                        title="Excluir Inscrição"
                        disabled={insc._isUpdating || isLoading}
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
        {inscriptions.length > 0 && <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">Total de inscrições: {inscriptions.length}</div>}
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