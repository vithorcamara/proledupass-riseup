import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#30A9DE] text-white py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-12">

        {/* Lado Esquerdo */}
        <div className="lg:w-1/3 flex flex-col justify-between">

          {/* Logo */}
          <Link to="/" className="group">
            <div className="flex items-center mb-4">
               <img
              src="/assets/logos/outline-white.png"
              alt="logo edupass branco"
              className="h-12 w-auto"
            />
            </div>

            {/* Texto */}
            <p className="text-sm leading-relaxed mb-8">
              Acreditamos que a dedicação é a chave para transformar
vidas e abrir portas para novas oportunidades.
            </p>
          </Link>

          {/* Copyright */}
          <p className="text-xs text-white/80">
            © Copyright 2026 Prol Educa - Todos os direitos reservados
          </p>
        </div>

        {/* Lado Direito */}
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-20">

          {/* Navegação */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-base mb-1">
              Navegação
            </h3>

            <Link
              to="/#beneficios"
              className="text-sm hover:underline underline-offset-2"
            >
              Benefícios
            </Link>

            <Link
              to="/#como-funciona"
              className="text-sm hover:underline underline-offset-2"
            >
              Como funciona
            </Link>

            <Link
              to="/#contemplacao"
              className="text-sm hover:underline underline-offset-2"
            >
              Contemplação
            </Link>

            <Link
              to="/#perguntas"
              className="text-sm hover:underline underline-offset-2"
            >
              Perguntas
            </Link>
          </div>

        {/* Coluna 2 */}
<div className="flex flex-col gap-3">
  <h3 className="font-bold text-base mb-1">
    Termos e Condições
  </h3>

  <span className="text-sm">
    Termos de uso
  </span>

  <span className="text-sm">
    Política de privacidade
  </span>
</div>

          {/* Contato */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-base mb-1">
              Contato
            </h3>

            <span className="text-sm">
              (81) 9 9576-0789
            </span>

            <a
              href="mailto:atendimento@proleduca.com.br"
              className="text-sm hover:underline underline-offset-2"
            >
              atendimento@proleduca.com.br
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}