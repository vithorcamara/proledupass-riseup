import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Footer from "../components/Footer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "../components/LoadingSpinner";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Informe seu nome completo"),
  email: Yup.string().email("E-mail inválido").required("Informe seu e-mail"),
  requestType: Yup.string().required("Selecione o tipo de solicitação"),
  subject: Yup.string().required("Informe o assunto"),
  description: Yup.string().required("Descreva sua solicitação"),
});

export default function Support() {
  const [status, setStatus] = useState({ category: "", message: "" });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Você pode usar `values` diretamente — é o objeto com os dados do formulário
    if (
      !values.fullName.trim() ||
      !values.email.trim() ||
      !values.subject.trim() ||
      !values.description.trim()
    ) {
      setStatus({
        category: "danger",
        message: "Por favor, preencha todos os campos para enviar.",
      });
      setSubmitting(false);
      return;
    }

    setStatus({
      category: "infor",
      message: "Enviando solicitação...",
    });

    try {
      const response = await axiosInstance.post("/support", values);

      if (response.status === 200) {
        setStatus({
          category: "success",
          message:
            "Sua solicitação foi enviada com sucesso! Responderemos em breve.",
        });
        resetForm();
      } else {
        setStatus({
          category: "danger",
          message: "Ocorreu um erro ao enviar. Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar suporte:", error);
      setStatus({
        category: "danger",
        message: "Ocorreu um erro ao enviar. Tente novamente mais tarde.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="bg-[#30ADE7] py-12 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Suporte</h1>
        <p className="text-lg md:text-xl">
          Precisa de ajuda? Fale com a gente!
        </p>
      </section>

      <main className="max-w-3xl mx-auto px-8 py-12">
        {status.category && (
          <div
            className={`p-3 mb-6 text-sm rounded-lg text-center ${
              status.category == "success"
                ? "bg-green-50 text-green-700 border border-green-300"
                : status.category == "danger"
                  ? "bg-red-50 text-red-700 border border-red-300"
                  : "bg-blue-50 text-blue-700 border border-blue-300"
            }`}
            role="alert"
          >
            {status.message}
          </div>
        )}

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            requestType: "",
            subject: "",
            description: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              {/* Nome completo */}
              <div>
                <label htmlFor="fullName" className="form-label">
                  Nome completo
                </label>
                <Field
                  id="fullName"
                  name="fullName"
                  className={`form-input ${touched.fullName && errors.fullName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Seu nome completo"
                />
                <ErrorMessage
                  name="fullName"
                  component="p"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <Field
                  id="email"
                  type="email"
                  name="email"
                  className={`form-input ${touched.email && errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="seuemail@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              {/* Tipo da solicitação */}
              <div>
                <label htmlFor="requestType" className="form-label">
                  Tipo da solicitação
                </label>
                <Field
                  as="select"
                  id="requestType"
                  name="requestType"
                  className={`form-input ${touched.requestType && errors.requestType ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Problema técnico">Problema técnico</option>
                  <option value="Dúvida">Dúvida</option>
                  <option value="Solicitação de acesso">
                    Solicitação de acesso
                  </option>
                  <option value="Erro no sistema">Erro no sistema</option>
                  <option value="Outros">Outros</option>
                </Field>
                <ErrorMessage
                  name="requestType"
                  component="p"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              {/* Assunto */}
              <div>
                <label htmlFor="subject" className="form-label">
                  Assunto
                </label>
                <Field
                  id="subject"
                  name="subject"
                  className={`form-input ${touched.subject && errors.subject ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Resumo da solicitação"
                />
                <ErrorMessage
                  name="subject"
                  component="p"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              {/* Descrição detalhada */}
              <div>
                <label htmlFor="description" className="form-label">
                  Descrição detalhada
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="4"
                  className={`form-input ${touched.description && errors.description ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Explique seu problema ou dúvida com detalhes..."
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              {/* Botão de envio */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn bg-[#30ADE7] text-white hover:bg-[#1C8FC3] py-3 flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="h-5 w-5" color="text-white" />
                      <span className="ml-2">Enviando sua solicitação...</span>
                    </>
                  ) : (
                    "Solicitar ajuda"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-700 font-semibold mb-1" htmlFor="nome">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              id="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#30ADE7]"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#30ADE7]"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1" htmlFor="mensagem">
              Mensagem
            </label>
            <textarea
              name="mensagem"
              id="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              required
              rows="6"
              className="w-full border rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#30ADE7]"
              placeholder="Descreva sua dúvida ou problema..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#30ADE7] text-white font-bold py-3 rounded-xl hover:bg-[#279acd] transition duration-300"
          >
            Enviar Solicitação
          </button>
        </form> */}
      </main>

      <Footer />
    </div>
  );
}
