// src/pages/admin/InstitutionForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import ConfirmModal from "../../components/ConfirmModal";
import MessageModal from "../../components/MessageModal";

const initialFormState = {
  fantasyName: "",
  cnpj: "",
  phoneNumber: "",
  email: "",
  password: ""
};

import { ArrowLeft } from "lucide-react";

const BackArrowIcon = () => (
  <ArrowLeft className="w-5 h-5 mr-2" />
);


export default function CompaniesForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [error, setError] = useState(null);
  const [cepError, setCepError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState(() => () => { });
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

  const { id: companyId } = useParams();

  // const institutionTypes = ["Escola", "Técnico", "Idiomas", "Superior", "Pós"];

  useEffect(() => {
    if (!isMessageModalOpen && shouldNavigate) {
      navigate("/admin/companies");
      setShouldNavigate(false);
    }
  }, [isMessageModalOpen, shouldNavigate, navigate]);

  useEffect(() => {
    if (companyId) {
      setIsLoading(true);
      axiosInstance.get(`/companies/${companyId}`)
        .then(res => {
          const { id, ...institutionData } = res.data;
          setFormData({ ...initialFormState, ...institutionData, status: typeof institutionData.status === 'boolean' ? institutionData.status : true });
        })
        .catch(err => {
          console.error("Erro ao buscar dados da empresa para edição:", err);
          setError("Não foi possível carregar os dados da empresa para edição.");
        })
        .finally(() => setIsLoading(false));
    } else {
      setFormData(initialFormState);
    }
  }, [companyId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // const handleCepBlur = async (e) => {
  //   const cep = e.target.value.replace(/\D/g, '');
  //   setCepError(null);

  //   if (cep.length === 8) {
  //     setIsFetchingCep(true);
  //     setError(null);
  //     try {
  //       const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  //       if (!response.ok) {
  //         const errorData = await response.json().catch(() => ({}));
  //         throw new Error(errorData.message || `Falha ao buscar CEP. Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       if (data.erro) throw new Error('CEP não encontrado ou inválido.');
  //       setFormData(prev => ({
  //         ...prev,
  //         street: data.logradouro || prev.street,
  //         neighborhood: data.bairro || prev.neighborhood,
  //         city: data.localidade || prev.city,
  //         state: data.uf || prev.state,
  //         complement: data.complemento || prev.complement,
  //       }));
  //     } catch (errCep) {
  //       setCepError(errCep.message || "Erro ao processar CEP.");
  //     } finally {
  //       setIsFetchingCep(false);
  //     }
  //   } else if (cep.length > 0) {
  //     setCepError("CEP deve conter 8 dígitos.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fantasyName.trim() ||
      !formData.cnpj.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setMessageModalProps({
        title: "Campos obrigatórios",
        message: "Por favor, preencha todos os campos obrigatórios.",
        success: false,
      });
      setIsMessageModalOpen(true);
      return;
    }

    if (!companyId && !formData.password) {
      setMessageModalProps({
        title: "Senha obrigatória",
        message: "É necessário adicionar uma senha de acesso.",
        success: false,
      });
      setIsMessageModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCepError(null);

    const apiPath = companyId ? `/companies/${companyId}` : "/companies/create";
    const method = companyId ? "put" : "post";

    try {
      await axiosInstance[method](apiPath, formData);

      // Modal de sucesso
      setMessageModalProps({
        title: companyId ? "Empresa atualizada" : "Empresa criada",
        message: `Empresa ${formData.fantasyName} ${companyId ? "atualizada" : "criada"} com sucesso!`,
        success: true,
        onClose: () => navigate("/admin/companies"),
      });
      setShouldNavigate(true);
      setIsMessageModalOpen(true);

    } catch (err) {
      console.error(`Erro ao ${companyId ? 'atualizar' : 'criar'} empresa:`, err.response?.data || err.message);
      const apiError = err.response?.data?.message || err.response?.data?.error || `Falha ao ${companyId ? 'atualizar' : 'criar'} empresa.`;

      // Modal de erro
      setMessageModalProps({
        title: "Erro",
        message: apiError,
        success: false,
      });
      setIsMessageModalOpen(true);

      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading && companyId) {
    return <div className="p-8 text-center">Carregando dados da empresa...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {companyId ? "Editar Empresa" : "Adicionar Nova Empresa"}
        </h1>
        <Link
          to="/admin/companies"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <BackArrowIcon />
          Voltar para Lista
        </Link>
      </header>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow" role="alert">
          <p className="font-bold">Erro na Operação</p>
          <p>{typeof error === 'object' ? JSON.stringify(error) : error}</p>
        </div>
      )}
      {cepError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow" role="alert">
          <p className="font-bold">Aviso CEP</p>
          <p>{cepError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-xl">
        {/* Informações da Empresa */}
        <fieldset className="mb-8">
          <legend className="text-lg font-medium text-gray-900 mb-3">Informações Principais</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 border-t border-gray-200 pt-4">
            {/* <div>
              <label htmlFor="cep" className="form-label">Nome da Empresa*{isFetchingCep ? '(Buscando...)' : ''}</label>
              <input type="text" name="cep" id="cep" value={formData.cep} onChange={handleInputChange} onBlur={handleCepBlur} placeholder="00000-000" maxLength="9" className="form-input" />
            </div> */}
            <div className="lg:col-span-2">
              <label htmlFor="fantasyName" className="form-label">Nome da Empresa*</label>
              <input type="text" name="fantasyName" id="fantasyName" value={formData.fantasyName} placeholder="Nome fantasia da empresa" onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <label htmlFor="cnpj" className="form-label">CNPJ*</label>
              <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleInputChange} placeholder="00.000.000/0000-00" className="form-input" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="form-label">Telefone*</label>
              <input type="text" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="(DD) XXXXX-XXXX" className="form-input" />
            </div>
            {/* <div>
              <label htmlFor="neighborhood" className="form-label">Bairro*</label>
              <input type="text" name="neighborhood" id="neighborhood" value={formData.neighborhood} onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <label htmlFor="complement" className="form-label">Complemento</label>
              <input type="text" name="complement" id="complement" value={formData.complement} onChange={handleInputChange} className="form-input" />
            </div>
            <div>
              <label htmlFor="city" className="form-label">Cidade*</label>
              <input type="text" name="city" id="city" value={formData.city} onChange={handleInputChange} required className="form-input" />
            </div>
            <div>
              <label htmlFor="state" className="form-label">Estado (UF)*</label>
              <input type="text" name="state" id="state" value={formData.state} onChange={handleInputChange} required maxLength="2" placeholder="Ex: PE" className="form-input" />
            </div> */}
          </div>
        </fieldset>

        {/* Informações de acesso */}
        <fieldset className="mb-8">
          <legend className="text-lg font-medium text-gray-900 mb-3">Informações de Acesso</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-200 pt-4">
            <div className="lg:col-span-1">
              <label htmlFor="email" className="form-label">E-mail de acesso*</label>
              <input type="text" name="email" id="email" value={formData.email} placeholder="E-mail de acesso a plataforma" onChange={handleInputChange} required className="form-input" />
            </div>
            {/* <div>
              <label htmlFor="type" className="form-label">Tipo*</label>
              <select name="type" id="type" value={formData.type} onChange={handleInputChange} required className="form-select">
                <option value="" disabled>Selecione o tipo</option>
                {institutionTypes.map(typeValue => (
                  <option key={typeValue} value={typeValue}>{typeValue}</option>
                ))}
              </select>
            </div> */}
            <div className="lg:col-span-1">
              <label htmlFor="password" className="form-label">Senha*</label>
              <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} placeholder={companyId ? "Deixe em branco para manter" : "Senha de acesso"} className="form-input" />
            </div>
            {/* <div className="flex items-center pt-5 self-end">
              <input type="checkbox" name="status" id="status" checked={formData.status} onChange={handleInputChange} className="form-checkbox h-5 w-5 text-blue-600" />
              <label htmlFor="status" className="ml-2 text-sm font-medium text-gray-700">Ativa</label>
            </div> */}
          </div>
        </fieldset>

        {/* Dados da Empresa */}
        {/* <fieldset className="mb-8">
          <legend className="text-lg font-medium text-gray-900 mb-3">Dados da Empresa</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 border-t border-gray-200 pt-4">
            <div><label className="form-label">CNPJ*</label><input type="text" name="cnpj" value={formData.cnpj} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Nome Fantasia*</label><input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Razão Social*</label><input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Senha*</label><input type="password" name="password" value={formData.password} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Responsável Financeiro</label><input type="text" name="responsavelFinanceiro" value={formData.responsavelFinanceiro} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Telefone Financeiro</label><input type="tel" name="telefoneFinanceiro" value={formData.telefoneFinanceiro} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Segmentos*</label><input type="text" name="segmentos" value={formData.segmentos} onChange={handleInputChange} className="form-input" /></div>
            <div>
              <label className="form-label">Empresa*</label>
              <select name="empresa" value={formData.empresa} onChange={handleInputChange} className="form-select">
                <option value="todas">Todas Empresas</option>
                <option value="1">ProlEduca / Jaboatão dos Guararapes - PE</option>
              </select>
            </div>
          </div>
        </fieldset> */}

        {/* Responsável */}
        {/* <fieldset className="mb-8">
          <legend className="text-lg font-medium text-gray-900 mb-3">Responsável</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 border-t border-gray-200 pt-4">
            <div><label className="form-label">Nome*</label><input type="text" name="respNome" value={formData.respNome} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Data de Nascimento*</label><input type="date" name="respNascimento" value={formData.respNascimento} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Telefone*</label><input type="tel" name="respTelefone" value={formData.respTelefone} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Email*</label><input type="email" name="respEmail" value={formData.respEmail} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">RG</label><input type="text" name="respRg" value={formData.respRg} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">CPF</label><input type="text" name="respCpf" value={formData.respCpf} onChange={handleInputChange} className="form-input" /></div>
          </div>
        </fieldset> */}

        {/* Responsável Operacional */}
        {/* <fieldset className="mb-8">
          <legend className="text-lg font-medium text-gray-900 mb-3">Responsável Operacional</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 border-t border-gray-200 pt-4">
            <div><label className="form-label">Nome*</label><input type="text" name="opNome" value={formData.opNome} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Telefone*</label><input type="tel" name="opTelefone1" value={formData.opTelefone1} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Telefone 2</label><input type="tel" name="opTelefone2" value={formData.opTelefone2} onChange={handleInputChange} className="form-input" /></div>
            <div><label className="form-label">Email*</label><input type="email" name="opEmail" value={formData.opEmail} onChange={handleInputChange} className="form-input" /></div>
          </div>
        </fieldset> */}

        {/* Botões */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0">
          <Link to="/admin/companies" type="button" className="btn btn-secondary w-full sm:w-auto text-center">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isLoading || isFetchingCep}>
            {isLoading ? "Salvando..." : (companyId ? "Salvar Alterações" : "Adicionar Empresa")}
          </button>
        </div>
      </form>
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

