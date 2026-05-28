// src/pages/PasswordRecoveryPage.jsx
import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import logo from "../../public/assets/logos/outline-white.png";

import { Eye, EyeOff } from "lucide-react";

const EyeIcon = ({ className = "w-5 h-5" }) => <Eye className={className} />;
const EyeSlashIcon = ({ className = "w-5 h-5" }) => (
  <EyeOff className={className} />
);

const EdupassLogo = ({
  className = "w-auto h-10",
  textColor = "text-white",
  accentColor = "text-yellow-300",
}) => (
  <div className={`font-bold text-3xl ${className}`}>
    <Link to="/">
      <img src={logo} alt="Logo" className="w-48 cursor-pointer" />
    </Link>
  </div>
);

export default function RecuperacaoSenha() {
  const [showPasswordNova, setShowPasswordNova] = useState(false);
  const [showPasswordConfirmar, setShowPasswordConfirmar] = useState(false);
  const [step, setStep] = useState("email"); // 'email' | 'code' | 'reset'
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendCode = async () => {
    setErrorMessage("");
    try {
      const response = await axiosInstance.post("/edupass/forgot-password", {
        email,
      });
      setStep("code");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Erro ao enviar código");
    }
  };

  const handleValidateCode = async () => {
    setErrorMessage("");
    try {
      const response = await axiosInstance.post("/edupass/validate-code", {
        email,
        code,
      });
      setStep("reset");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Código inválido");
    }
  };

  const handleResetPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axiosInstance.post("/edupass/reset-password", {
        email,
        password: newPassword,
      });

      setSuccessMessage("Senha alterada com sucesso!");
      window.location.href = "/login";
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erro ao redefinir senha",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#30ADE7] to-[#1C7FBF] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Esquerda */}
        <div className="w-full md:w-2/5 bg-[#30ADE7] p-8 sm:p-10 md:p-12 text-white flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <EdupassLogo
            className="h-10 md:h-12 mb-8"
            textColor="text-white"
            accentColor="text-yellow-300"
          />
          <h1 className="text-2xl font-bold mb-4">Esqueceu a senha?</h1>
          <p className="text-blue-100 mb-8">
            Não se preocupe, vamos te ajudar a recuperar o acesso à sua conta.
          </p>
          <Link
            to="/login"
            className="px-6 py-2 font-semibold rounded-lg bg-white text-[#30ADE7] hover:bg-blue-50 transition-all duration-150 transform hover:scale-105"
          >
            Voltar ao Login
          </Link>
        </div>

        {/* Direita */}
        <div className="w-full md:w-3/5 p-8 sm:p-10 md:p-12 bg-white">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Recuperar Senha
            </h2>
            <p className="text-gray-500 mt-1">
              Informe seu e-mail e siga as etapas.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 mb-6 text-sm rounded-lg text-center bg-red-50 text-red-700 border border-red-300">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 mb-6 text-sm rounded-lg text-center bg-green-50 text-green-700 border border-green-300">
              {successMessage}
            </div>
          )}

          {/* Etapa: Email */}
          {step === "email" && (
            <div className="space-y-4">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="seuemail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSendCode}
                className="btn w-full bg-[#30ADE7] text-white hover:bg-[#1C8FC3]"
              >
                Enviar Código
              </button>
            </div>
          )}

          {/* Etapa: Código */}
          {step === "code" && (
            <div className="space-y-4">
              <label htmlFor="code" className="form-label">
                Código recebido
              </label>
              <input
                id="code"
                type="text"
                className="form-input"
                placeholder="Digite o código"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={handleValidateCode}
                className="btn w-full bg-[#30ADE7] text-white hover:bg-[#1C8FC3]"
              >
                Validar Código
              </button>
            </div>
          )}

          {/* Etapa: Redefinir Senha */}
          {step === "reset" && (
            <div className="space-y-4">
              <label htmlFor="new-password" className="form-label">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPasswordNova ? "text" : "password"}
                  className="form-input pr-10"
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordNova(!showPasswordNova)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Alternar visibilidade da senha"
                >
                  {showPasswordNova ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>

              <label htmlFor="confirm-password" className="form-label">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showPasswordConfirmar ? "text" : "password"}
                  className="form-input pr-10"
                  placeholder="Confirme a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordConfirmar(!showPasswordConfirmar)
                  }
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Alternar visibilidade da senha"
                >
                  {showPasswordConfirmar ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>

              <button
                onClick={handleResetPassword}
                className="btn w-full bg-[#30ADE7] text-white hover:bg-[#1C8FC3]"
              >
                Redefinir Senha
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
