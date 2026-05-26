import { useState } from "react";
import { Link } from "react-router-dom";

export function HeaderLP() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logo = "/assets/logos/default.png";

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full">
          <nav className="hidden md:flex items-center space-x-10 flex-1">
            <div className="flex-shrink-0">
              <Link to="/">
                <img src={logo} alt="Logo" className="w-32 cursor-pointer" />
              </Link>
            </div>

            <Link
              to="/#beneficios"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Benefícios
            </Link>

            <Link
              to="/#como-funciona"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Como Funciona
            </Link>

            <Link
              to="/#contemplacao"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Contemplação
            </Link>

            <Link
              to="/#depoimentos"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Depoimentos
            </Link>

            <Link
              to="/#perguntas"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Perguntas
            </Link>

            <div className="flex items-center space-x-3 ml-auto">
              <Link
                to="/contratar-beneficio"
                className="btn text-sm bg-[#30ADE7] text-[#ffff] hover:bg-[#2a8fc9] rounded-[8px] px-6 py-3"
              >
                Contratar Benefício
              </Link>
            </div>
          </nav>

          <div className="md:hidden flex items-center w-full">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-32 cursor-pointer" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ml-auto"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-40 p-2 transition transform origin-top">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/#beneficios"
              onClick={closeMobileMenu}
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Benefícios
            </Link>
            <Link
              to="/#como-funciona"
              onClick={closeMobileMenu}
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Como funciona
            </Link>
            <Link
              to="/#contemplacao"
              onClick={closeMobileMenu}
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Contemplação
            </Link>
            <Link
              to="/#depoimentos"
              onClick={closeMobileMenu}
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Depoimentos
            </Link>
            <Link
              to="/#perguntas"
              onClick={closeMobileMenu}
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Perguntas
            </Link>
          </div>

          <div className="pt-4 pb-3 border-t border-slate-200 space-y-3">
            <Link
              to="/contratar-beneficio"
              className="btn text-sm bg-[#30ADE7] text-[#ffff] hover:bg-[#2a8fc9] rounded-[8px] px-6 py-3 mr-4 ml-4"
            >
              Contratar Benefício
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
