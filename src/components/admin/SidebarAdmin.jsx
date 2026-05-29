import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Building2,
  University,
  BookOpen,
  Users,
  UserCheck,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";

const DashboardIcon = () => (
  <Home className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);
const CompanyIcon = () => (
  <Building2 className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);
const InstitutionsIcon = () => (
  <University className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);
const CoursesIcon = () => (
  <BookOpen className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);
const UsersIcon = () => (
  <Users className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);
const ScholarshipHoldersIcon = () => (
  <UserCheck className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);
const InscriptionsIcon = () => (
  <FileText className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);
const ShieldCheckIcon = () => (
  <ShieldCheck className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);
const ClockIcon = () => (
  <Clock className="w-5 h-5 mr-3 group-hover:text-white transition-colors" />
);

const NavItem = ({ to, icon, children }) => {
  const baseClasses =
    "group flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out";
  const activeClasses = "bg-blue-700 text-white shadow-inner";
  const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      {icon}
      <span className="truncate">{children}</span>
    </NavLink>
  );
};

export default function SidebarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="w-64 h-screen bg-slate-800 text-white flex flex-col fixed top-0 left-0 z-40 shadow-lg">
      <div className="px-4 h-16 flex items-center border-b border-slate-700">
        {" "}
        {/*  */}
        <h2 className="text-lg font-semibold text-white truncate">
          Painel Administrativo
        </h2>
      </div>

      {/* Navegação com rolagem interna */}
      <nav className="flex-grow px-3 py-4 space-y-1.5 overflow-y-auto">
        {" "}
        {/*  */}
        <NavItem to="/admin/dashboard" icon={<DashboardIcon />}>
          Dashboard
        </NavItem>
        <NavItem to="/admin/companies" icon={<CompanyIcon />}>
          Empresas
        </NavItem>
        <NavItem to="/admin/institutions" icon={<InstitutionsIcon />}>
          Instituições
        </NavItem>
        <NavItem to="/admin/courses" icon={<CoursesIcon />}>
          Cursos
        </NavItem>
        <NavItem to="/admin/users" icon={<UsersIcon />}>
          Usuários
        </NavItem>
        <NavItem
          to="/admin/scholarship-holders"
          icon={<ScholarshipHoldersIcon />}
        >
          Bolsistas
        </NavItem>
        <NavItem to="/admin/registrations" icon={<InscriptionsIcon />}>
          Inscrições
        </NavItem>
        <NavItem to="/admin/WaitList" icon={<ClockIcon />}>
          Aguardando Vaga
        </NavItem>
        <NavItem to="/admin/AuthorizedUsers" icon={<ShieldCheckIcon />}>
          Usuários Autorizados
        </NavItem>
      </nav>
      <div className="px-4 mb-8">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          Sair
        </button>
      </div>

      {/* Rodapé da Sidebar */}
      <div className="px-4 py-3 border-t border-slate-700 mt-auto">
        <p className="text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} Edupass
        </p>
      </div>
    </aside>
  );
}
