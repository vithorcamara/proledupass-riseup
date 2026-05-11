// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../api/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import MessageModal from "../components/MessageModal";

import { ArrowLeft } from "lucide-react";

const BackArrowIcon = ({ className = "w-5 h-5 mr-2" }) => (
  <ArrowLeft className={className} />
);


// const raceColorOptions = ["Parda", "Branca", "Preta", "Amarela", "Indígena", "Não Declarada"];

const formatCpf = (cpf) => {
  if (!cpf) return '';
  const cleanCpf = String(cpf).replace(/\D/g, '');
  if (cleanCpf.length === 11) {
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cpf;
};

const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleanPhone = String(phone).replace(/\D/g, '');

  if (cleanPhone.length === 11) {
    // Celular (com 9 dígitos)
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    // Telefone fixo (com 8 dígitos)
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  // Se não tiver 10 ou 11 dígitos, retorna só os números digitados
  return cleanPhone;
};

const formatDate = (value) => {
  value = value.replace(/\D/g, "");

  // Adiciona as barras no formato dd/mm/aaaa
  if (value.length > 2 && value.length <= 4) {
    value = value.replace(/(\d{2})(\d+)/, "$1/$2");
  } else if (value.length > 4) {
    value = value.replace(/(\d{2})(\d{2})(\d+)/, "$1/$2/$3");
  }

  return value;
};

export default function ProfilePage() {
  // Valores iniciais do formulário
  const [initialValues, setInitialValues] = useState({
    fullName: "",
    email: "",
    cpf: "",
    dateOfBirth: "",
    phone: "",
    // needs: false,
    // raceColor: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  // const [isEditLoading, setIsEditLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
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
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();

  // Obtém o ID do usuário logado do localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!isMessageModalOpen && shouldNavigate) {
      navigate("/");
      setShouldNavigate(false);
    }
  }, [isMessageModalOpen, shouldNavigate, navigate]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // lê aqui dentro
    if (!storedUser || !storedUser.id) {
      setApiError("Usuário não autenticado. Por favor, faça login.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    axiosInstance
      .get(`/customers/${storedUser.id}`)
      .then((res) => {
        const data = res.data;
        const dob = data.dateOfBirth || data.dateOfbirth || null;

        setInitialValues({
          fullName: data.fullName || "",
          email: data.email || "",
          cpf: data.cpf || "",
          dateOfBirth: dob ? dob.split("T")[0] : "",
          phone: data.phone || "",
        });
      })
      .catch((err) => {
        console.error(
          "Erro ao buscar dados do perfil:",
          err.response?.data || err.message
        );
        setApiError(
          "Não foi possível carregar os dados do perfil. Tente novamente mais tarde."
        );
      })
      .finally(() => setIsLoading(false));
  }, [navigate]); // <-- removemos user daqui


  // Esquema de validação
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Nome completo é obrigatório."),
    dateOfBirth: Yup.date()
      .max(new Date(), "Data de nascimento não pode ser no futuro.")
      .required("Data de nascimento é obrigatória."),
    phone: Yup.string()
      .required("Telefone é obrigatório.")
      .matches(
        /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/,
        "Formato de telefone inválido (ex: (DD) XXXXX-XXXX ou 11999998888)."
      ),
    // needs: Yup.boolean(),
    // raceColor: Yup.string().required('Raça/Cor é obrigatória.'),
  });

  // Envio do formulário
  const handleSubmit = async (values, { setSubmitting }) => {
    setApiError(null);
    // setIsLoading(true);
    // setIsEditLoading(true);

    const payload = {
      fullName: values.fullName,
      dateOfBirth: values.dateOfBirth,
      phone: String(values.phone).replace(/\D/g, ""),
    };

    // return console.log(payload);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user")); // lê aqui dentro
      if (!storedUser || !storedUser.id) {
        setApiError("Usuário não autenticado.");
        return;
      }

      const response = await axiosInstance.put(`/customers/${storedUser.id}`, payload);

      if (response.status === 200 || response.status === 204) {
      // Modal de sucesso
      setMessageModalProps({
        title: "Perfil atualizado com sucesso!",
        message: `Agora seu perfil está atualizado com os novos dados.`,
        success: true,
        onClose: () => navigate("/"),
      });
      setShouldNavigate(true);
      setIsMessageModalOpen(true);

        // alert("Perfil atualizado com sucesso!");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...storedUser, fullName: values.fullName })
        );
        
        setInitialValues({
          ...initialValues,
          fullName: values.fullName,
          dateOfBirth: values.dateOfBirth,
          phone: values.phone,
        });

      } else {
        console.warn("Resposta recebida, mas com status inesperado:", response.status);
      }

    } catch (err) {
      console.error(
        "Erro ao atualizar perfil:",
        err.response?.data || err.message
      );
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Falha ao atualizar perfil. Tente novamente.";
      setApiError(errorMessage);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="h-12 w-12" />
        <p className="ml-3 text-gray-600">Carregando dados do perfil...</p>
      </div>
    );
  }

  // Mensagem para usuários não logados após o carregamento
  if (!user || !user.id) {
    return (
      <div className="p-8 text-center text-red-600 bg-gray-100 min-h-screen">
        <p>Você precisa estar logado para acessar esta página.</p>
        <Link to="/login" className="text-blue-600 hover:underline mt-4 block">Ir para Login</Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Meu Perfil
        </h1>
        <Link
          to="/"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <BackArrowIcon />
          Voltar para Home
        </Link>
      </header>

      {apiError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
          <p className="font-bold">Erro</p>
          <p>{apiError}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 max-w-3xl mx-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form className="space-y-6">
              <fieldset>
                <legend className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label htmlFor="fullName" className="form-label">Nome Completo</label>
                    <Field
                      id="fullName"
                      type="text"
                      name="fullName"
                      placeholder="Seu nome completo"
                      className={`form-input ${touched.fullName && errors.fullName ? 'border-red-500' : ''}`}
                    />
                    <ErrorMessage name="fullName" component="p" className="text-red-600 text-xs mt-1" />
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <Field
                      id="email"
                      type="email"
                      name="email"
                      className="form-input bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <Field
                      id="cpf"
                      type="text"
                      name="cpf"
                      value={formatCpf(values.cpf)}
                      className="form-input bg-gray-100 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="dateOfBirth" className="form-label">Data de Nascimento</label>
                    <Field name="dateOfBirth">
                      {({ field, form }) => (
                        <input
                          {...field} id="dateOfBirth" maxLength={10} className={`form-input ${ form.touched.dateOfBirth && form.errors.dateOfBirth ? "border-red-500" : ""
                          }`}
                          onChange={(e) => { const formatted = formatDate(e.target.value); form.setFieldValue("dateOfBirth", formatted);
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="dateOfBirth" component="p" className="text-red-600 text-xs mt-1" />
                  </div>
                  <Field name="phone">
                    {({ field, form }) => (
                      <div>
                        <label htmlFor="phone" className="form-label">Telefone</label>
                        <input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder="(DD) XXXXX-XXXX"
                          value={formatPhone(field.value)} // ✅ sempre exibe formatado
                          onChange={(e) => {
                            // remove tudo que não for número antes de salvar no Formik
                            const onlyNumbers = e.target.value.replace(/\D/g, '');
                            form.setFieldValue(field.name, onlyNumbers);
                          }}
                          className={`form-input ${form.touched.phone && form.errors.phone ? 'border-red-500' : ''}`}
                        />
                        <ErrorMessage name="phone" component="p" className="text-red-600 text-xs mt-1" />
                      </div>
                    )}
                  </Field>
                  {/* <div>
                    <label htmlFor="raceColor" className="form-label">Raça/Cor</label>
                    <Field
                      id="raceColor"
                      as="select"
                      name="raceColor"
                      className={`form-select ${touched.raceColor && errors.raceColor ? 'border-red-500' : ''}`}
                    >
                      <option value="">Selecione...</option>
                      {raceColorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </Field>
                    <ErrorMessage name="raceColor" component="p" className="text-red-600 text-xs mt-1" />
                  </div> */}

                  {/* <div className="md:col-span-2 flex items-center pt-2">
                    <Field
                      type="checkbox"
                      id="needs"
                      name="needs"
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="needs" className="ml-2 text-sm font-medium text-gray-700">
                      Possui Necessidades Especiais
                    </label>
                  </div> */}
                </div>
              </fieldset>

              <div className="pt-6 border-t border-gray-200 mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full sm:w-auto flex items-center justify-center py-3"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="h-5 w-5 mr-2" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
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