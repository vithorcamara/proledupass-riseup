import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/assets/logos/default.png";

import { User, UserCheck, Briefcase, Users, LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

const UserIcon = () => (
  <User className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
);
const ProfileIcon = () => (
  <UserCheck className="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-600 transition-colors" />
);
const BriefcaseIcon = () => (
  <Briefcase className="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-600 transition-colors" />
);
const UsersGroupIcon = () => (
  <Users className="w-5 h-5 mr-3 text-slate-500 group-hover:text-blue-600 transition-colors" />
);
const LogoutIcon = () => (
  <LogOut className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-500 transition-colors" />
);

export default function Header({ userLoggedIn, setUserLoggedIn }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Para menu hambúrguer
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = userLoggedIn ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserLoggedIn(false);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });

    navigate("/portal/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full">
          <nav className="hidden md:flex items-center space-x-10 flex-1">
            <div className="flex-shrink-0">
              <Link to="/portal">
                <img src={logo} alt="Logo" className="w-32 cursor-pointer" />
              </Link>
            </div>
            {/* <Link
              href="#comofunciona"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Como Funciona
            </Link> */}
            <Link
              to="/portal/#comofunciona"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Como Funciona
            </Link>
            {/* <Link
              to="/"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Para Empresas
            </Link> */}
            <Link
              to="/portal/beneficios"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Benefícios
            </Link>
            <Link
              to="/portal/suport"
              className="text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] transition-colors"
            >
              Suporte
            </Link>
            {userLoggedIn && user?.roles?.includes("ROLE_ADMIN") && (
              <Link
                to="/admin/dashboard"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Painel Admin
              </Link>
            )}

            {userLoggedIn ? (
              <div ref={dropdownRef} className="relative ml-auto">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  aria-label="Menu do usuário"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <UserIcon />
                  <span className="text-sm font-medium text-gray-700">
                    Área do colaborador
                  </span>
                </button>

                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 py-1 origin-top-right transition-all duration-150 ease-out transform opacity-100 scale-100" // Animação suave
                    role="menu"
                    aria-orientation="vertical"
                  >
                    {user && (
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {user.fullName || user.email || "Usuário"}
                        </p>
                        {user.email && user.fullName && (
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="py-1">
                      <Link
                        to="/portal/perfil"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600 w-full transition-colors "
                        role="menuitem"
                      >
                        <ProfileIcon /> Perfil
                      </Link>
                      <Link
                        to="/minhas-bolsas"
                        onClick={() => setIsDropdownOpen(false)}
                        className="group flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600 w-full transition-colors"
                        role="menuitem"
                      >
                        <BriefcaseIcon /> Minhas Bolsas
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="group flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full transition-colors"
                        role="menuitem"
                      >
                        <LogoutIcon /> Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-auto">
                <Link
                  to="/portal/cadastro"
                  className="btn text-sm rounded-[8px] px-4 py-2 bg-[#F5F7F8] hover:bg-[#E6EAEC]"
                >
                  Cadastre-se Grátis
                </Link>
                <Link
                  to="/portal/login"
                  className="btn text-sm bg-[#30ADE7] text-[#ffff] hover:bg-[#219ed8] rounded-[8px] px-6 py-3"
                >
                  Entrar
                </Link>
              </div>
            )}
          </nav>

          {/* Botão do Menu Hambúrguer (Mobile) */}
          <div className="md:hidden flex items-center w-full">
            <Link to="/portal">
              <img src={logo} alt="Logo" className="w-32 cursor-pointer" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ml-auto"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
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
                  aria-hidden="true"
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

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg z-40 p-2 transition transform origin-top"
          id="mobile-menu"
        >
          <div className="pt-2 pb-3 space-y-1">
            {/* <Link
              to="/"
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Parceria Instituições
            </Link> */}
            <Link
              to="/portal/#comofunciona"
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Como funciona
            </Link>
            <Link
              to="/portal/beneficios"
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Benefícios
            </Link>
            <Link
              to="/portal/suport"
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Suporte
            </Link>{" "}
            {/* <Link
              to="/"
              className="block px-4 py-2 text-sm font-bold text-[#2F2F2F] hover:text-[#30ADE7] hover:bg-[#F0F8FC] rounded transition-colors"
            >
              Para Empresas
            </Link> */}
            {userLoggedIn && user?.roles?.includes("ROLE_ADMIN") && (
              <Link
                to="/admin/dashboard"
                onClick={closeMobileMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
              >
                Painel Admin
              </Link>
            )}
          </div>
          {userLoggedIn ? (
            <div className="pt-4 pb-3 border-t border-slate-200">
              {user && (
                <div className="flex items-center px-4 mb-3">
                  <div className="flex-shrink-0 mr-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-600">
                      <UserIcon />
                    </div>
                  </div>
                  <div>
                    <div className="text-base font-medium text-slate-800">
                      {user.fullName || user.email || "Usuário"}
                    </div>
                    {user.email && user.fullName && (
                      <div className="text-sm font-medium text-slate-500">
                        {user.email}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <Link
                  to="/perfil"
                  onClick={closeMobileMenu}
                  className="group flex items-center px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-md"
                >
                  <ProfileIcon /> Perfil
                </Link>
                <Link
                  to="/minhas-bolsas"
                  onClick={closeMobileMenu}
                  className="group flex items-center px-4 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-md"
                >
                  <BriefcaseIcon /> Minhas Bolsas
                </Link>
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-4 py-2.5 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 w-full rounded-md"
                >
                  <LogoutIcon /> Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-slate-200 space-y-3">
              <Link
                to="/portal/login"
                className="btn text-sm bg-[#30ADE7] text-[#ffff] hover:bg-[#219ed8] rounded-[8px] px-6 py-3 mr-4"
              >
                Entrar
              </Link>
              <Link
                to="/portal/cadastro"
                className="btn text-sm rounded-[8px] px-4 py-2 bg-[#F5F7F8] hover:bg-[#E6EAEC]"
              >
                Cadastre-se Grátis
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
