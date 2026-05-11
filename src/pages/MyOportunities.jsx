import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import axiosInstance from '../api/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import MessageModal from "../components/MessageModal";
import Footer from '../components/Footer';
import Contract from '../components/Contract';
// utils
import { enrollmentRenewalDate } from '../utils/enrollmentRenewalDate';
import { formatBrlCurrency } from '../utils/formatBrlCurrency';

const defaultLogo = 'https://via.placeholder.com/100/E0E0E0/9E9E9E?text=Logo';

const StatusBadge = ({ status }) => {

  let bgColor, textColor, textDisplay;
  const normalizedStatus = status ? status.toLowerCase() : 'desconhecido';

  switch (normalizedStatus) {
    case 'pendente':
      textDisplay = 'Aguardando Vaga';
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      break;

    case 'matriculado':
      textDisplay = 'Matriculado';
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      break;

    case 'concluido':
      textDisplay = 'Concluído';
      bgColor = 'bg-green-100';
      textColor = 'text-green-700';
      break;

    case 'cancelado':
      textDisplay = 'Cancelada';
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      break;

    default:
      textDisplay = status || 'Desconhecido';
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-700';
  }

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {textDisplay}
    </span>
  );
};

export default function MyOportunities() {
  const [registrations, setRegistrations] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const loggedInCustomerCpfRef = useRef(null);
  const initialFetchDoneRef = useRef(false);

  const processAndSetRegistrations = useCallback((apiData, customerId) => {
    let allSystemRegistrations = [];
    if (Array.isArray(apiData)) {
      allSystemRegistrations = apiData;
    } else if (apiData && Array.isArray(apiData.content)) {
      allSystemRegistrations = apiData.content;
    } else {
      console.warn("MyOportunities: API (TODAS) resposta para inscrições não é um array esperado. Data:", apiData);
    }

    const userSpecificRegistrations = allSystemRegistrations.filter(reg =>
      reg.scholarshipHolders &&
      reg.scholarshipHolders.customers &&
      Number(reg.scholarshipHolders.customers.id) === Number(customerId)
    );

    let determinedCustomerCpf = loggedInCustomerCpfRef.current;
    if (!determinedCustomerCpf && userSpecificRegistrations.length > 0) {
      const firstUserReg = userSpecificRegistrations[0];
      if (firstUserReg.scholarshipHolders.customers.cpf) {
        determinedCustomerCpf = firstUserReg.scholarshipHolders.customers.cpf.replace(/[^\d]/g, '');
        loggedInCustomerCpfRef.current = determinedCustomerCpf; // Armazena na ref
      } else {
        console.warn("MyOportunities: Não foi possível extrair o CPF do cliente logado dos dados das suas inscrições.");
      }
    }

    if (!determinedCustomerCpf && userSpecificRegistrations.length > 0) {
      console.warn("MyOportunities: CPF do cliente logado não pôde ser determinado. A diferenciação 'Dependente' pode não ser precisa.");
    }

    const processedRegistrations = userSpecificRegistrations.map(reg => {
      const scholarshipHolder = reg.scholarshipHolders || {};
      const scholarshipHolderCpfClean = scholarshipHolder.cpf ? scholarshipHolder.cpf.replace(/[^\d]/g, '') : null;
      const isOwnScholarship = determinedCustomerCpf && scholarshipHolderCpfClean === determinedCustomerCpf;

      return {
        ...reg,
        beneficiaryName: scholarshipHolder.fullName || 'Beneficiário não informado',
        isOwnScholarship: isOwnScholarship,
        scholarshipHolderId: scholarshipHolder.id,
        course: reg.courses || {},
        institution: reg.courses?.institutions || {}
      };
    }).sort((a, b) => {
      if (a.status.status === 'Cancelado' && b.status.status !== 'Cancelado') return 1;
      if (a.status.status !== 'Cancelado' && b.status.status === 'Cancelado') return -1;
      return new Date(b.registrationDate) - new Date(a.registrationDate);
    });

    setRegistrations(processedRegistrations);
  }, []);

  const fetchInitialData = useCallback(async () => {
    if (!user || !user.id) {
      setError("Usuário não autenticado.");
      setLoading(false);
      if (window.location.pathname !== "/login") navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/registrations`);
      processAndSetRegistrations(response.data, user.id);
    } catch (err) {
      console.error("Erro ao buscar inscrições:", err);
      setError(err.response?.data?.message || "Não foi possível carregar suas inscrições.");
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  }, [user, navigate, processAndSetRegistrations]);

  useEffect(() => {
    if (user && user.id && !initialFetchDoneRef.current) {
      fetchInitialData();
      initialFetchDoneRef.current = true;
    } else if (!user) {
      if (window.location.pathname !== "/login") {
        navigate("/login");
      }
      setLoading(false);
    }
  }, [user, navigate, fetchInitialData]);


  const confirmarAcao = ({ onConfirm, title, message }) => {
    setModalProps({
      title: title || "Tem certeza?",
      message: message || "Você deseja realmente continuar?",
    });
    setOnConfirmCallback(() => onConfirm);
    setIsModalOpen(true);
  };
  // ----------------------------------------------

  // Função principal de cancelamento
  const handleCancelRegistration = async (registrationId) => {
    setLoading(true);
    try {
      const registrationToUpdate = registrations.find(
        (reg) => reg.id === registrationId
      );

      if (!registrationToUpdate) {
        // Modal de sucesso
        setMessageModalProps({
          title:"Erro",
          message: `Inscrição não encontrada para atualização.`,
          success: true,
        });
        setIsMessageModalOpen(true);

        setLoading(false);
        return;
      }

      const payload = {
        statusId: 4,
        registrationDate: registrationToUpdate.registrationDate,
        scholarshipHolderId: registrationToUpdate.scholarshipHolderId,
        courseId: registrationToUpdate.course?.id,
      };

      await axiosInstance.put(`/registrations/${registrationId}`, payload);
      // Modal de sucesso
      setMessageModalProps({
        title:"Inscrição cancelada com sucesso!",
        message:``,
        success: true,
      });
      setIsMessageModalOpen(true);

      initialFetchDoneRef.current = false;
      await fetchInitialData(); // função sua de recarregamento
    } catch (err) {
      console.error("Erro ao cancelar inscrição:", err.response?.data || err.message);
      alert(`Erro ao cancelar inscrição: ${err.response?.data?.message || 'Ocorreu um erro.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Chamada inicial com confirmação
  const confirmarCancelamento = (registrationId) => {
    confirmarAcao({
      title: "Tem certeza que deseja cancelar sua matrícula?",
      message: "Essa ação não poderá ser desfeita. Ao cancelar sua matrícula, você perderá todos os benefícios relacionados a esta bolsa, e a vaga poderá ser disponibilizada para outro candidato. Deseja realmente continuar com o cancelamento?",
      onConfirm: () => handleCancelRegistration(registrationId),
    });
  };

  if (loading && registrations.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <LoadingSpinner size="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Minhas Bolsas
          </h1>
          <p className="mt-3 text-md sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Acompanhe aqui todas as bolsas de estudo às quais você se candidatou. Gerencie suas inscrições e fique por dentro do progresso de cada uma.
          </p>
        </div>

        {/* Mensagem de Loading Sutil para Re-fetches */}
        {loading && registrations.length > 0 && (
          <div className="text-center py-6">
            <LoadingSpinner size="h-8 w-8" />
            <p className="text-sm text-slate-500 mt-2">Atualizando...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-10">
            <p className="text-red-600 text-lg">{error}</p>
            <button onClick={() => { initialFetchDoneRef.current = false; fetchInitialData(); }} className="mt-4 btn btn-primary">Tentar Novamente</button>
          </div>
        )}
        {!loading && !error && registrations.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-600 text-lg">Você ainda não possui bolsas ou inscrições associadas à sua conta.</p>
            <button onClick={() => navigate('/')} className="mt-4 btn btn-primary">
              Ver Oportunidades
            </button>
          </div>
        )}

        {!loading && !error && registrations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {registrations.map((registration) => {
              const course = registration.course;
              const institution = registration.institution;
              const location = [institution.city, institution.state].filter(Boolean).join(', ') || 'Não informada';

              return (
                <div
                  key={registration.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={institution.urlImage || defaultLogo}
                        alt={`Logo ${institution.name || 'da instituição'}`}
                        className="w-16 h-16 rounded-md object-contain flex-shrink-0 border border-slate-200"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-slate-800 leading-tight">
                          {institution.name || 'Nome da Instituição Não Informado'}
                        </h2>
                        <p className="text-xs text-slate-500">{location}</p>
                      </div>
                    </div>

                    <h3 className="text-md font-medium text-blue-600 mb-1">
                      Curso: {course.name || 'Nome da Bolsa Não Informado'}
                    </h3>
                    <p className="text-sm text-slate-700 mb-3">
                      Beneficiário: <span className="font-medium">{registration.beneficiaryName}</span>
                      {!registration.isOwnScholarship && loggedInCustomerCpfRef.current && (
                        <span className="text-xs text-slate-500"> (Dependente)</span>
                      )}
                    </p>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-slate-700 mb-1">Status da Inscrição:</p>
                      <StatusBadge status={registration.status.status} />
                    </div>

                    <p className="text-xs text-slate-500 mt-3 mb-3">
                      Data da Inscrição: {registration.registrationDate ? new Date(registration.registrationDate).toLocaleDateString() : 'N/A'}
                    </p>

                    <div className="">
                      <p className="text-xs text-slate-500">
                        Renovação prevista: {enrollmentRenewalDate(registration.registrationDate)}
                      </p>
                      <p className="text-sm font-medium text-slate-700">
                        Valor de renovação: {formatBrlCurrency(registration.courses.discountValue)}
                      </p>
                    </div>

                  </div>

                  <div className="bg-slate-50 p-4 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                      {/* implementação verificação se o curso é ensino básico */}
                      {registration.status?.status && registration.status.status.toLowerCase() !== 'cancelado' && registration.status.status.toLowerCase() !== 'pendente' && (
                        <PDFDownloadLink document={<Contract registration={registration} />} fileName="contrato-edupass.pdf">
                          {({ loading }) =>
                            loading ? 'Carregando contrato...' : <button className="w-full sm:w-auto btn btn-primary text-sm py-2 px-4">Baixar contrato</button>
                          }
                        </PDFDownloadLink>
                      )}
                      <button
                        onClick={() => navigate(`/bolsa/${course.id}`)}
                        className="w-full sm:w-auto btn btn-secondary text-sm py-2 px-4"
                        disabled={!course.id}
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => confirmarCancelamento(registration.id)}
                        className="w-full sm:w-auto btn btn-danger text-sm py-2 px-4"
                      >
                        Cancelar Inscrição
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
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