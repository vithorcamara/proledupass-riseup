// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';

import AboutUs from './pages/AboutUs.jsx';
import Benefits from './pages/Benefits.jsx';
import BolsaPage from './pages/BolsaPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import CadastroBolsista from './pages/CadastroBolsista.jsx';
import Login from './pages/Login.jsx';
import RegisterForm from './pages/RegisterForm.jsx';
import MyOportunities from './pages/MyOportunities.jsx';
import MyCourses from './pages/MyCourses.jsx';
import RecuperacaoSenha from './pages/RecuperacaoSenha.jsx';
import Suport from './pages/Suport.jsx';
import LandingPage from './pages/LandingPage.jsx';

// Componentes do Admin
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Institutions from './pages/admin/Institutions.jsx';
import InstitutionForm from './pages/admin/InstitutionForm.jsx';
import Courses from './pages/admin/Courses.jsx';
import CourseForm from './pages/admin/CoursesForm.jsx';
import Users from './pages/admin/Users.jsx';
// import UserForm from './pages/admin/UserForm.jsx'; 
import ScholarshipHolders from './pages/admin/ScholarshipHolders.jsx';
import ScholarshipHolderForm from './pages/admin/ScholarshipHolderForm.jsx';
import Registrations from './pages/admin/Registrations.jsx';
import RegistrationsDetails from './pages/admin/RegistrationsDetails.jsx';
// import Dependents from './pages/admin/Dependents.jsx'; 
// import DependentForm from './pages/admin/DependentForm.jsx'; 
import ProfilePage from './pages/ProfilePage.jsx';
import Companies from './pages/admin/Companies.jsx';
import CompaniesForm from './pages/admin/CompaniesForm.jsx';
import WaitList from './pages/admin/WaitList.jsx';
import AuthorizedUsers from './pages/admin/AuthorizedUsers.jsx';
import AuthorizedUsersForm from './pages/admin/AuthorizedUsersForm.jsx';

// componentes company
import CompanyLayout from './components/company/CompanyLayout.jsx';
import Employees from './pages/company/Employees.jsx';
import CompanyDashboard from './pages/company/CompanyDashboard.jsx';
import CompanyRegistrations from './pages/company/CompanyRegistrations.jsx';
import CompanyRegistrationsDetails from './pages/company/CompanyRegistrationsDetails.jsx';
import CompanyPaymentHistory from './pages/company/CompanyPaymentHistory.jsx';
import CompanyCheckout from './pages/company/CompanyCheckout.jsx';
import CompanyAuthorizedUsers from './pages/company/CompanyAuthorizedUsers.jsx';
import CompanyAuthorizedUsersForm from './pages/company/CompanyAuthorizedUsersForm.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';

import { AppProvider } from './contexts/AppContext.jsx';
import { OpportunitiesProvider } from './contexts/OpportunitiesContext.jsx';

import './index.css';

// Landing Page
import { About_app } from "./components/landing_page/About-app.jsx";
import { BenefitInfo } from "./components/landing_page/Benefit-info.jsx";
import LPLayout from './components/landing_page/LPLayout.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "quem-somos", element: <AboutUs />},
      { path: "beneficios", element: <Benefits />},
      { path: "login", element: <Login /> },
      { path: "cadastro", element: <RegisterForm /> },
      { path: "bolsa/:id", element: <BolsaPage /> },
      { path: "inscricao/:id", element: <CadastroBolsista /> },
      { path: "minhas-bolsas", element: <MyOportunities /> },
      { path: "favoritos", element: <FavoritesPage /> },
      { path: "meus-cursos", element: <MyCourses /> },
      { path: "perfil", element: <ProfilePage /> },
      { path: "recuperacao-senha", element: <RecuperacaoSenha /> },
      { path: "suport", element: <Suport /> },
    ],
  },
  {
    element: <PrivateRoute roles={["ROLE_ADMIN"]} redirectTo="/login" />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "companies", element: <Companies /> },
          { path: "companies/new", element: <CompaniesForm /> },
          { path: "companies/edit/:id", element: <CompaniesForm /> },
          { path: "institutions", element: <Institutions /> },
          { path: "institutions/new", element: <InstitutionForm /> },
          { path: "institutions/edit/:id", element: <InstitutionForm /> },
          { path: "courses", element: <Courses /> },
          { path: "courses/new", element: <CourseForm /> },
          { path: "courses/edit/:id", element: <CourseForm /> },
          { path: "users", element: <Users /> },
          { path: "scholarship-holders", element: <ScholarshipHolders /> },
          { path: "scholarship-holders/new", element: <ScholarshipHolderForm /> },
          { path: "scholarship-holders/edit/:id", element: <ScholarshipHolderForm /> },
          { path: "registrations", element: <Registrations /> },
          { path: "registrations/:id", element: <RegistrationsDetails /> },
          { path: "WaitList", element: <WaitList /> },
          { path: "AuthorizedUsers", element: <AuthorizedUsers />},
          { path: "AuthorizedUsers/new", element: <AuthorizedUsersForm />},
          { path: "AuthorizedUsers/edit/:id", element: <AuthorizedUsersForm />},
        ]
      }
    ]
  },
  {
    element: <PrivateRoute roles={["ROLE_COMPANY"]} redirectTo="/login" />,
    children: [
      {
        path: "/company",
        element: <CompanyLayout />,
        children: [
          { path: "dashboard", element: <CompanyDashboard /> },
          { path: "employees", element: <Employees /> },
          { path: "registrations", element: <CompanyRegistrations /> },
          { path: "registrations/:id", element: <CompanyRegistrationsDetails /> },
          { path: "payments", element: <CompanyPaymentHistory /> },
          { path: "checkout", element: <CompanyCheckout /> },
          { path: "AuthorizedUsers", element: <CompanyAuthorizedUsers /> },
          { path: "AuthorizedUsers/new", element: <CompanyAuthorizedUsersForm />},
        ]
      }
    ]
  },
  {
    path: "/LP",
    element: <LPLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "About-app", element: <About_app />},
    ],
  },
], { basename: "/portal" });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <OpportunitiesProvider>
        <RouterProvider router={router} />
      </OpportunitiesProvider>
    </AppProvider>
  </StrictMode>
);
