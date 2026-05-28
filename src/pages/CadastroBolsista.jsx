// src/pages/CadastroBolsista.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../api/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import MessageModal from "../components/MessageModal";

const validarCPF = (cpf) => {
  if (!cpf) return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0,
    resto;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
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

export default function CadastroBolsista() {
  const { id: opportunityId } = useParams();
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

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!isMessageModalOpen && shouldNavigate) {
      navigate("/minhas-bolsas");
      setShouldNavigate(false);
    }
  }, [isMessageModalOpen, shouldNavigate, navigate]);

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        const res = await axiosInstance.get(`/courses/${opportunityId}`);
        setOpportunity(res.data);
      } catch (error) {
        console.error("Erro ao buscar dados da oportunidade:", error);
      } finally {
        setLoading(false);
      }
    }

    if (opportunityId) {
      fetchOpportunity();
    } else {
      setLoading(false);
      console.error("ID da oportunidade não encontrado na URL.");
    }
  }, [opportunityId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </main>
    );
  }

  if (!opportunity) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Dados da oportunidade não puderam ser carregados ou não foram
          encontrados.
        </p>
      </main>
    );
  }

  if (!user || !user.id) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Usuário não autenticado ou ID do usuário não encontrado. Por favor,
          faça login novamente.
        </p>
      </main>
    );
  }

  const inst = opportunity?.institutions;
  const location = inst
    ? `${inst.street || ""}, ${inst.number || ""} - ${inst.city || ""} / ${inst.state || ""}`
        .replace(/ , |, - | - /g, ", ")
        .replace(/^,|, $/g, "")
    : "Localização não disponível";

  const initialValues = {
    fullName: user?.fullName || "",
    cpf: user?.cpf || "",
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
    needs: "",
    raceColor: "",
    alreadyStudentAtInstitution: false,
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Nome completo é obrigatório."),
    cpf: Yup.string()
      .required("CPF é obrigatório.")
      .test("valid-cpf", "CPF inválido.", (value) => validarCPF(value)),
    dateOfBirth: Yup.date()
      .max(new Date(), "Data de nascimento não pode ser no futuro.")
      .required("Data de nascimento é obrigatória.")
      .transform((value, originalValue) => {
        if (originalValue && typeof originalValue === "string") {
          const parts = originalValue.split("/");
          if (parts.length === 3 && parts[2].length === 4) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
          }

          const date = new Date(originalValue + "T00:00:00");
          return isNaN(date.getTime()) ? undefined : date;
        }
        return value;
      }),
    needs: Yup.string()
      .oneOf(["sim", "não"], 'Selecione "Sim" ou "Não".')
      .required("Campo obrigatório."),
    raceColor: Yup.string().required("Raça/Cor é obrigatória."),
    alreadyStudentAtInstitution: Yup.boolean(),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldError },
  ) => {
    try {
      const cpfSemFormatacao = values.cpf.replace(/[^\d]/g, "");
      // const needsBoolean = values.needs.toLowerCase().trim() !== 'nenhuma';
      const needsBoolean = values.needs === "sim";

      const bolsistaPayload = {
        customers: user.id,
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth,
        needs: needsBoolean,
        cpf: cpfSemFormatacao,
        raceColor: values.raceColor,
      };

      const bolsistaRes = await axiosInstance.post(
        "/scholarship-holders/create",
        bolsistaPayload,
      );
      const bolsistaId = bolsistaRes.data?.scholarshipHoldeId;

      if (!bolsistaId && bolsistaId !== 0) {
        let errorMessage =
          "ID do bolsista não retornado corretamente após a criação.";
        if (bolsistaRes.data && typeof bolsistaRes.data === "object") {
          errorMessage += ` Resposta recebida: ${JSON.stringify(bolsistaRes.data)}`;
        } else {
          errorMessage += ` Resposta recebida: ${String(bolsistaRes.data)}`;
        }
        throw new Error(errorMessage);
      }

      const inscricaoPayload = {
        scholarshipHolderId: bolsistaId,
        courseId: parseInt(opportunityId),
        registrationDate: new Date().toISOString().split("T")[0],
      };

      const inscricaoRes = await axiosInstance.post(
        "/registrations/create",
        inscricaoPayload,
      );

      if (inscricaoRes.data && inscricaoRes.data.id) {
        localStorage.setItem(
          "lastKnownRegistrationId",
          inscricaoRes.data.id.toString(),
        );
      } else {
        console.warn(
          "Não foi possível obter o ID da inscrição da resposta da API para salvar no localStorage.",
        );
      }

      setMessageModalProps({
        title: "Inscrição realizada com sucesso!",
        message: `Inscrição foi realizada com sucesso!`,
        success: true,
        onClose: () => navigate("/minhas-bolsas"),
      });
      setShouldNavigate(true);
      setIsMessageModalOpen(true);
      // resetForm();
    } catch (error) {
      console.error(
        "Erro ao enviar dados:",
        error.response?.data || error.message,
      );
      const apiError =
        error.response?.data?.message ||
        error.message ||
        "Ocorreu um erro desconhecido.";

      // Modal de erro
      setMessageModalProps({
        title: "Erro",
        message: apiError,
        success: false,
      });
      setIsMessageModalOpen(true);

      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          const formikField = key.includes(".") ? key.split(".")[1] : key;
          if (initialValues.hasOwnProperty(formikField)) {
            setFieldError(formikField, value);
          }
        });
      }

      // Modal de erro
      setMessageModalProps({
        title: "Erro ao realizar inscrição.",
        message: "CPF invalido ou ja cadastrado.",
        success: false,
      });
      setIsMessageModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-8 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Formulário de Inscrição
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Você está se inscrevendo para:{" "}
                <span className="font-semibold text-[#30ADE7]">
                  {opportunity.name}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                Instituição: {inst?.name || "N/A"} | Local: {location}
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, dirty, isValid, errors, touched, values }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label htmlFor="fullName" className="form-label">
                        Nome Completo do Bolsista*
                      </label>
                      <Field
                        id="fullName"
                        type="text"
                        name="fullName"
                        placeholder="Nome completo do bolsista"
                        className={`form-input ${touched.fullName && errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      />
                      <ErrorMessage
                        name="fullName"
                        component="p"
                        className="text-red-600 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="cpf" className="form-label">
                        CPF do Bolsista*
                      </label>
                      <Field
                        id="cpf"
                        type="text"
                        name="cpf"
                        placeholder="000.000.000-00"
                        className={`form-input ${touched.cpf && errors.cpf ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      />
                      <ErrorMessage
                        name="cpf"
                        component="p"
                        className="text-red-600 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className="form-label">
                        Data de Nascimento do Bolsista*
                      </label>
                      <Field name="dateOfBirth">
                        {({ field, form }) => (
                          <input
                            {...field}
                            id="dateOfBirth"
                            maxLength={10}
                            className={`form-input ${
                              form.touched.dateOfBirth &&
                              form.errors.dateOfBirth
                                ? "border-red-500"
                                : ""
                            }`}
                            onChange={(e) => {
                              const formatted = formatDate(e.target.value);
                              form.setFieldValue("dateOfBirth", formatted);
                            }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="dateOfBirth"
                        component="p"
                        className="text-red-600 text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="needs" className="form-label">
                        Necessidades Especiais*
                      </label>
                      <Field
                        id="needs"
                        as="select"
                        name="needs"
                        className={`form-select ${touched.needs && errors.needs ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      >
                        <option value="">Selecione...</option>
                        <option value="sim">Sim</option>
                        <option value="não">Não</option>
                      </Field>
                      <ErrorMessage
                        name="needs"
                        component="p"
                        className="text-red-600 text-xs mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="raceColor" className="form-label">
                        Raça/Cor do Bolsista*
                      </label>
                      <Field
                        id="raceColor"
                        as="select"
                        name="raceColor"
                        className={`form-select ${touched.raceColor && errors.raceColor ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      >
                        <option value="">Selecione...</option>
                        <option value="Branca">Branca</option>
                        <option value="Preta">Preta</option>
                        <option value="Parda">Parda</option>
                        <option value="Amarela">Amarela</option>
                        <option value="Indígena">Indígena</option>
                        <option value="Prefiro não dizer">
                          Prefiro não dizer
                        </option>
                      </Field>
                      <ErrorMessage
                        name="raceColor"
                        component="p"
                        className="text-red-600 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <Field
                      id="alreadyStudentAtInstitution"
                      type="checkbox"
                      name="alreadyStudentAtInstitution"
                      className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                    />
                    <div>
                      <label
                        htmlFor="alreadyStudentAtInstitution"
                        className="text-sm font-medium text-amber-800 cursor-pointer"
                      >
                        Eu já estudei na instituição {inst?.name || "N/A"}
                      </label>
                      <p className="text-xs text-amber-700 mt-1">
                        Marque esta opção se você já estudou nesta instituição.
                        {values.alreadyStudentAtInstitution && (
                          <span className="block font-medium mt-1">
                            Você não poderá se inscrever nesta bolsa pois já
                            estudou nesta instituição.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !dirty ||
                        !isValid ||
                        values.alreadyStudentAtInstitution
                      }
                      className={`w-full btn text-white py-3 text-base flex items-center justify-center ${
                        values.alreadyStudentAtInstitution
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#30ADE7] hover:shadow-xl cursor-pointer"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="h-5 w-5 mr-2" />
                          Enviando Inscrição...
                        </>
                      ) : values.alreadyStudentAtInstitution ? (
                        "Inscrição não permitida - Já foi estudante da instituição"
                      ) : (
                        "Confirmar Inscrição"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
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
        </main>
        <Footer />
      </div>
    </>
  );
}
