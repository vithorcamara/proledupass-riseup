// src/pages/admin/AuthorizedUsersForm.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmModal from "../../components/ConfirmModal";
import MessageModal from "../../components/MessageModal";

import { ArrowLeft, Search } from "lucide-react";

const BackArrowIcon = () => (
  <ArrowLeft className="w-5 h-5 mr-1.5" />
);

const SearchIconInput = ({ className = "w-4 h-4 text-gray-400" }) => (
  <Search className={className} strokeWidth={2} />
);


export default function AuthorizedUsersForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const [initialValues, setInitialValues] = useState({
        companyId: '',
        name: '',
        cpf: '',
        rg: '',
        email: '',
        phone: '',
        estado: '',
        cidade: '',
        bairro: '',
        empresaId: ''
    });

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [companies, setCompanies] = useState([]);
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

    useEffect(() => {
        if (!isMessageModalOpen && shouldNavigate) {
        navigate("/admin/AuthorizedUsers");
        setShouldNavigate(false); // reseta o flag
        }
    }, [isMessageModalOpen, shouldNavigate, navigate]);

    useEffect(() => {
    axiosInstance.get(`/companies`)
      .then(res => {
        setCompanies(res.data);
        // console.log(res);
      })
      .catch(err => {
        console.error("Erro ao buscar lista de empresas:", err);
      })
  }, []);

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            axiosInstance.get(`/AuthorizedUsers/${id}`)
                .then(response => {
                    const data = response.data;
                    setInitialValues({
                        companyId: data.company?.id || '',
                        name: data.name || '',
                        cpf: data.cpf || '',
                        rg: data.rg || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        estado: data.estado || '',
                        cidade: data.cidade || '',
                        bairro: data.bairro || ''
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Erro ao buscar dados:", error);
                    setFormError(`Não foi possível carregar os dados: ${error.message}`);
                    setLoading(false);
                });
        }
    }, [id, isEditing]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Campo obrigatório'),
        cpf: Yup.string()
        .transform((value) => value.replace(/\D/g, '')) // remove tudo que não é número
        .required('Campo obrigatório')
        .length(11, 'CPF deve ter 11 dígitos'),
        rg: Yup.string().required('Campo obrigatório'),
        email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
        phone: Yup.string().required('Campo obrigatório'),
        estado: Yup.string().required('Campo obrigatório'),
        cidade: Yup.string().required('Campo obrigatório'),
        bairro: Yup.string().required('Campo obrigatório'),
        empresaId: Yup.number()
        .typeError("Selecione uma empresa")
        .required("Selecione uma empresa")
        .moreThan(0, "Selecione uma empresa válida"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setFormError('');
        setSubmitting(true);

        // Monta o payload com os campos do formulário
        const payload = {
            companyId: parseInt(values.companyId, 10),
            name: values.name,
            cpf: values.cpf.replace(/\D/g, ''),
            rg: values.rg,
            email: values.email,
            phone: values.phone,
            estado: values.estado,
            cidade: values.cidade,
            bairro: values.bairro,
            empresaId: values.empresaId,
        };

        try {
            if (isEditing) {
                await axiosInstance.put(`/AuthorizedUsers/${id}`, payload);
                setMessageModalProps({
                    title: "Usuário atualizado",
                    message: `Usuário ${payload.name} atualizado com sucesso!`,
                    success: true,
                    onClose: () => navigate("/admin/AuthorizedUsers"),
                });
            } else {
                await axiosInstance.post('/AuthorizedUsers/create', payload);
                setMessageModalProps({
                    title: "Usuário criado",
                    message: `Usuário ${payload.name} criado com sucesso!`,
                    success: true,
                    onClose: () => navigate("/admin/AuthorizedUsers"),
                });

                // Limpa o formulário após criação
                resetForm({
                    values: {
                        companyId: '',
                        name: '',
                        cpf: '',
                        rg: '',
                        email: '',
                        phone: '',
                        estado: '',
                        cidade: '',
                        bairro: ''
                    }
                });
            }

            setShouldNavigate(true);
            setIsMessageModalOpen(true);

        } catch (error) {
            console.error("Erro ao salvar:", error.response?.data || error.message);
            setFormError(error.response?.data?.message || `Ocorreu um erro ao salvar: ${error.message}`);

            // Exibe modal de erro
            setMessageModalProps({
                title: "Erro",
                message: "Ocorreu um erro ao salvar os dados.",
                success: false,
            });
            setIsMessageModalOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <LoadingSpinner size="h-10 w-10" />
                <p className="ml-3 text-gray-600">Carregando dados...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                 <button
                    onClick={() => navigate('/admin/AuthorizedUsers')}
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 mb-6 group"
                >
                    <BackArrowIcon />
                    Voltar para Lista de Autorizados
                </button>

                <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
                        {isEditing ? 'Editar Usuário Autorizado' : 'Adicionar Usuário Autorizado'} 
                    </h1>

                    {formError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                            <p className="font-bold">Erro ao Salvar</p>
                            <p>{formError}</p>
                        </div>
                    )}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting, dirty, isValid, errors, touched }) => (
                            <Form className="space-y-6">

                                {/* Campo de busca e seleção de empresa */}
                                {/* <div>
                                    <label htmlFor="companyId" className="form-label">Empresa*</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIconInput />
                                        </div>
                                        <input
                                            type="text"
                                            id="companySearch"
                                            placeholder="Buscar empresa pelo nome..."
                                            value={companySearchTerm}
                                            onChange={(e) => setCompanySearchTerm(e.target.value)}
                                            className="form-input pl-10 mb-2 w-full"
                                        />
                                    </div>
                                    <Field
                                        as="select"
                                        name="companyId"
                                        id="companyId"
                                        className={`form-input ${touched.companyId && errors.companyId ? 'border-red-500' : ''}`}
                                        disabled={allCompanies.length === 0 && !companySearchTerm}
                                    >
                                        <option value="">
                                            {allCompanies.length === 0 && !companySearchTerm
                                                ? "Carregando..."
                                                : filteredCompanies.length === 0 && companySearchTerm
                                                ? "Nenhuma encontrada"
                                                : "Selecione na lista"}
                                        </option>
                                        {filteredCompanies.map(comp => (
                                            <option key={comp.id} value={comp.id}>{comp.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="companyId" component="div" className="form-error" />
                                </div> */}

                                {/* Nome */}
                                <div>
                                    <label htmlFor="name" className="form-label">Nome*</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Digite o nome completo"
                                        className={`form-input ${touched.name && errors.name ? 'border-red-500' : ''}`}
                                    />
                                    <ErrorMessage name="name" component="div" className="form-error" />
                                </div>

                                {/* CPF e RG */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="cpf" className="form-label">CPF*</label>
                                        <Field
                                            type="text"
                                            name="cpf"
                                            id="cpf"
                                            placeholder="Ex: 000.000.000-00"
                                            className={`form-input ${touched.cpf && errors.cpf ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="cpf" component="div" className="form-error" />
                                    </div>
                                    <div>
                                        <label htmlFor="rg" className="form-label">RG*</label>
                                        <Field
                                            type="text"
                                            name="rg"
                                            id="rg"
                                            placeholder="Ex: 0.000.000"
                                            className={`form-input ${touched.rg && errors.rg ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="rg" component="div" className="form-error" />
                                    </div>
                                </div>

                                {/* E-mail e Telefone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="form-label">E-mail*</label>
                                        <Field
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="exemplo@email.com"
                                            className={`form-input ${touched.email && errors.email ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="email" component="div" className="form-error" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="form-label">Telefone*</label>
                                        <Field
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            placeholder="(00) 00000-0000"
                                            className={`form-input ${touched.phone && errors.phone ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="phone" component="div" className="form-error" />
                                    </div>
                                </div>

                                {/* Estado, Cidade, Bairro */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="estado" className="form-label">Estado*</label>
                                        <Field
                                            type="text"
                                            name="estado"
                                            id="estado"
                                            placeholder="Ex: PE"
                                            className={`form-input ${touched.estado && errors.estado ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="estado" component="div" className="form-error" />
                                    </div>
                                    <div>
                                        <label htmlFor="cidade" className="form-label">Cidade*</label>
                                        <Field
                                            type="text"
                                            name="cidade"
                                            id="cidade"
                                            placeholder="Ex: Recife"
                                            className={`form-input ${touched.cidade && errors.cidade ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="cidade" component="div" className="form-error" />
                                    </div>
                                    <div>
                                        <label htmlFor="bairro" className="form-label">Bairro*</label>
                                        <Field
                                            type="text"
                                            name="bairro"
                                            id="bairro"
                                            placeholder="Ex: Boa Viagem"
                                            className={`form-input ${touched.bairro && errors.bairro ? 'border-red-500' : ''}`}
                                        />
                                        <ErrorMessage name="bairro" component="div" className="form-error" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="empresaId" className="form-label">Selecione sua empresa*</label>
                                    <Field
                                        as="select"
                                        name="empresaId"
                                        id="empresaId"
                                        className={`form-select ${touched.empresaId && errors.empresaId ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Selecione uma empresa</option>
                                        {companies.length > 0 &&
                                        companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                            {company.fantasyName}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="empresaId" component="p" className="text-red-600 text-xs mt-1" />
                                </div>

                                {/* Botão de envio */}
                                <div className="pt-6 border-t border-gray-200 mt-8">
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full flex justify-center items-center py-3 text-base"
                                        disabled={isSubmitting || !dirty || !isValid || loading}
                                    >
                                        {isSubmitting || loading ? (
                                            <>
                                                <LoadingSpinner size="h-5 w-5 mr-2" />
                                                Salvando...
                                            </>
                                        ) : (isEditing ? 'Atualizar Dados' : 'Adicionar Cadastro')}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
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
