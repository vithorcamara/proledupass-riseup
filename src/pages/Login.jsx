// src/pages/Login.jsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import LoadingSpinner from "../components/LoadingSpinner";
import logo from "../../public/assets/logos/outline-white.png";
import { Bold, Eye, EyeOff } from "lucide-react";

import { useModal } from "../hooks/useModal";
import { ModalDialog } from "../components/ModalDialog";

// ------------------------------------ FIREBASE ------------------------------------------
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyB0v4eDS32GnEcg2dQgxUMtGWOPSoryhbk",
  authDomain: "proledupass-riseup.firebaseapp.com",
  projectId: "proledupass-riseup",
  storageBucket: "proledupass-riseup.firebasestorage.app",
  messagingSenderId: "97715703551",
  appId: "1:97715703551:web:f4aee25e10f0f3cb2d06ca",
  measurementId: "G-61QVT19NG6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// ------------------------------------ FIREBASE ------------------------------------------

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

const validationSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("Campo obrigatório"),
  password: Yup.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .required("Campo obrigatório"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUserLoggedIn } = useOutletContext();

  const { isOpen, openModal, closeModal } = useModal();

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    setMessage("");

    const auth = getAuth();
    const email = values.email;
    const password = values.password;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("token", user.accessToken);
        const userToStore = { email: values.email, id: user.uid, roles: [] };
        localStorage.setItem("user", JSON.stringify(userToStore));

        setUserLoggedIn(true);
        setMessage("Login realizado com sucesso! Redirecionando...");

        navigate("/portal");
      })
      .catch((error) => {
        console.error("Erro no login:", error.response?.data || error.message);
        const apiMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Erro ao conectar com o servidor.";
        setMessage(apiMessage);
        setSubmitting(false);
      });
    // try {
    //   const response = await axiosInstance.post("/edupass/login", values);
    //   if (response.status === 200 && response.data?.accessToken) {
    //     const { accessToken, userId, roles = [] } = response.data;
    //     localStorage.setItem("token", accessToken);
    //     const userToStore = { email: values.email, id: userId, roles };
    //     localStorage.setItem("user", JSON.stringify(userToStore));
    //     setUserLoggedIn(true);
    //     setMessage("Login realizado com sucesso! Redirecionando...");

    //     setTimeout(() => {
    //       if (roles.includes("ROLE_ADMIN")) {
    //         navigate("/admin/dashboard");
    //       } else if (roles.includes("ROLE_COMPANY")) {
    //         navigate("/company/dashboard");
    //       } else {
    //         navigate("/portal");
    //       }
    //     }, 1500);
    //   } else {
    //     const apiMessage =
    //       response.data?.message ||
    //       response.data?.error ||
    //       "E-mail ou senha inválidos.";
    //     setMessage(apiMessage);
    //     setSubmitting(false);
    //   }
    // } catch (error) {
    //   console.error("Erro no login:", error.response?.data || error.message);
    //   const apiMessage =
    //     error.response?.data?.message ||
    //     error.response?.data?.error ||
    //     "Erro ao conectar com o servidor.";
    //   setMessage(apiMessage);
    //   setSubmitting(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#30ADE7] to-[#1C7FBF] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Seção Esquerda - Informativa/Branding - COM INFORMAÇÕES MELHORADAS */}
        <div className="w-full md:w-2/5 bg-[#30ADE7] p-8 sm:p-10 md:p-12 text-white flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <EdupassLogo
            className="h-10 md:h-12 mb-8 self-center md:self-start"
            textColor="text-white"
            accentColor="text-yellow-300"
          />

          <h1 className="text-2xl sm:text-2xl lg:text-2xl font-bold mb-4 leading-tight">
            Novo por aqui?
          </h1>
          <p className="text-blue-100 text-base lg:text mb-8 leading-relaxed">
            Crie sua conta e tenha acesso a bolsas de estudo exclusivas e cursos
            para impulsionar sua carreira!
          </p>
          <Link
            to="/cadastro"
            className="px-8 py-3 font-semibold rounded-lg bg-white text-[#30ADE7] hover:bg-blue-50 shadow-md transition-all duration-150 ease-in-out transform hover:scale-105"
          >
            Criar uma conta
          </Link>
          <p className="text-xs text-blue-200 mt-10">
            Ao se registrar, você concorda com nossos
            <a onClick={openModal} className="underline hover:text-yellow-300">
              {" "}
              Termos de Serviço e Política de Privacidade{" "}
            </a>
            .
            {/* <a onClick={openModal} className="underline hover:text-yellow-300">Política de Privacidade</a>. */}
          </p>
        </div>

        {/* Seção Direita - Formulário de Login (mantém o design anterior) */}
        <div className="w-full md:w-3/5 p-8 sm:p-10 md:p-12 bg-white">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Acesse sua conta
            </h2>
            <p className="text-gray-500 mt-1">Bem-vindo(a) de volta!</p>
          </div>

          {message && (
            <div
              className={`p-3 mb-6 text-sm rounded-lg text-center ${
                message.includes("sucesso")
                  ? "bg-green-50 text-green-700 border border-green-300"
                  : "bg-red-50 text-red-700 border border-red-300"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email-login" className="form-label">
                    E-mail
                  </label>
                  <Field
                    id="email-login"
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

                <div>
                  <label htmlFor="password-login" className="form-label">
                    Senha
                  </label>
                  <div className="relative">
                    <Field
                      id="password-login"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`form-input pr-10 ${touched.password && errors.password ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Esconder senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>

                <div className="flex items-center justify-end text-sm">
                  <a
                    href="recuperacao-senha"
                    className="font-medium text-[#30ADE7] hover:text-blue-500 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn bg-[#30ADE7] text-[#FFFF] hover:bg-[#1C8FC3] cursor-pointer py-3 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="h-5 w-5" color="text-white" />
                        <span className="ml-2">Entrando...</span>
                      </>
                    ) : (
                      "Acessar a plataforma"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <ModalDialog isOpen={isOpen} onClose={closeModal}>
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-4">
            Termos de Uso – Prol EduPass
          </h2>
          <p className="text-sm text-gray-700">
            <b>Data de Vigência: Agosto/2025</b>
          </p>

          <div className="space-y-4 text-gray-800 text-sm">
            <p>
              Seja bem-vindo ao <b>Prol EduPass</b>. Ao acessar ou utilizar
              nossos serviços, você concorda com os termos e condições descritos
              abaixo. Recomendamos que leia atentamente este documento antes de
              utilizar nossa plataforma.
            </p>

            <h4 className="text-lg font-semibold">1. Aceitação dos Termos</h4>
            <p>
              Ao acessar o <b>Prol EduPass</b>, você declara estar de acordo com
              estes Termos de Uso e com nossa Política de Privacidade. Caso não
              concorde com algum dos termos, por favor, não utilize a
              plataforma.
            </p>

            <h4 className="text-lg font-semibold">2. Uso da Plataforma</h4>
            <p>
              O usuário compromete-se a utilizar a plataforma de forma lícita,
              ética e responsável, abstendo-se de:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Praticar atos que violem a legislação vigente;</li>
              <li>
                Inserir, transmitir ou disseminar conteúdos racistas,
                discriminatórios, ofensivos, ilegais ou que atentem contra os
                direitos humanos;
              </li>
              <li>
                Comprometer a segurança ou funcionamento da plataforma por meio
                de vírus, ataques ou softwares maliciosos;
              </li>
              <li>
                Copiar, reproduzir ou distribuir, total ou parcialmente,
                qualquer conteúdo da plataforma sem autorização prévia e
                expressa.
              </li>
            </ul>

            <h4 className="text-lg font-semibold">
              3. Cadastro e Conta do Usuário
            </h4>
            <p>Alguns serviços podem exigir cadastro prévio. Nesse caso:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                O usuário é responsável por manter a confidencialidade de suas
                informações de login;
              </li>
              <li>É proibido o uso de identidade falsa ou de terceiros;</li>
              <li>
                Atividades suspeitas poderão resultar em suspensão ou
                cancelamento da conta.
              </li>
            </ul>

            <h4 className="text-lg font-semibold">
              4. Propriedade Intelectual
            </h4>
            <p>
              Todo o conteúdo disponível no <b>Prol EduPass</b>, incluindo
              textos, imagens, vídeos, logotipos e marcas, é de propriedade
              exclusiva da Prol Educa ou de seus parceiros. Esse material é
              protegido por leis de direitos autorais e de propriedade
              intelectual. O uso não autorizado poderá acarretar sanções civis e
              penais.
            </p>

            <h4 className="text-lg font-semibold">5. Links Externos</h4>
            <p>
              A plataforma pode conter links para sites de terceiros. Não temos
              controle sobre esses sites e não nos responsabilizamos pelo
              conteúdo, práticas ou políticas de privacidade adotadas por eles.
            </p>

            <h4 className="text-lg font-semibold">
              6. Responsabilidades e Limitações
            </h4>
            <p>
              Nos empenhamos em manter as informações atualizadas e corretas,
              porém não garantimos a precisão ou integralidade de todo o
              conteúdo.
            </p>
            <p>
              O uso das informações e funcionalidades é de inteira
              responsabilidade do usuário.
            </p>
            <p>
              O <b>Prol EduPass</b> não se responsabiliza por:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Danos diretos ou indiretos resultantes do uso da plataforma;
              </li>
              <li>
                Interrupções, falhas técnicas ou indisponibilidades temporárias;
              </li>
              <li>Conteúdo inserido por terceiros ou usuários.</li>
            </ul>

            <h4 className="text-lg font-semibold">
              7. Cookies e Dados Coletados
            </h4>
            <p>
              O uso da plataforma implica consentimento para coleta e tratamento
              de dados, conforme descrito em nossa{" "}
              <b>Política de Privacidade</b>. Utilizamos cookies para melhorar a
              experiência do usuário, sendo possível gerenciá-los nas
              configurações do navegador.
            </p>

            <h4 className="text-lg font-semibold">8. Alterações nos Termos</h4>
            <p>
              Reservamo-nos o direito de atualizar ou modificar estes Termos de
              Uso a qualquer momento, sem aviso prévio. Recomendamos que o
              usuário revise este documento periodicamente. O uso contínuo da
              plataforma após alterações será considerado como aceitação das
              novas condições.
            </p>

            <h4 className="text-lg font-semibold">9. Contato</h4>
            <p>
              Em caso de dúvidas, sugestões ou solicitações relacionadas a estes
              Termos de Uso ou à Política de Privacidade, entre em contato
              conosco pelos canais oficiais disponíveis no site do{" "}
              <b>Prol EduPass</b>.
            </p>

            {/* <h4 className="text-lg font-semibold">10. Legislação Aplicável</h4>
            <p>Regido pelas leis do Brasil, com foro na comarca de [cidade/UF].</p> */}

            <hr className="my-6 border-gray-300" />

            <h2 className="text-2xl font-bold mb-2">
              Política de Privacidade – Prol EduPass
            </h2>
            <p className="text-sm text-gray-700">
              <b>Data de Vigência: Agosto/2025</b>
            </p>

            <div className="space-y-4 text-gray-800 text-sm">
              <p>
                A sua privacidade é importante para nós. É política do{" "}
                <b>Prol EduPass</b> respeitar a sua privacidade em relação a
                qualquer informação que possamos coletar em nosso site,
                plataforma ou outros domínios que possuímos e operamos.
              </p>

              <h4 className="text-lg font-semibold">
                1. Coleta e Uso de Informações Pessoais
              </h4>
              <p>
                Coletamos informações pessoais apenas quando realmente
                necessário para fornecer nossos serviços. Essa coleta é
                realizada por meios justos e legais, com o seu conhecimento e
                consentimento. Sempre informamos:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Por que estamos coletando os dados;</li>
                <li>Como eles serão utilizados.</li>
              </ul>
              <p>
                <b>Armazenamento:</b> os dados são mantidos apenas pelo tempo
                necessário para a prestação dos serviços solicitados.
              </p>
              <p>
                <b>Segurança:</b> utilizamos medidas técnicas e organizacionais
                adequadas para evitar perda, roubo, acesso, divulgação, cópia,
                uso ou modificação não autorizada.
              </p>

              <h4 className="text-lg font-semibold">
                2. Compartilhamento de Dados
              </h4>
              <p>
                Não compartilhamos suas informações pessoais com terceiros ou
                publicamente, exceto quando houver obrigação legal.
              </p>

              <h4 className="text-lg font-semibold">
                3. Links para Sites de Terceiros
              </h4>
              <p>
                Nosso site e plataforma podem conter links para páginas externas
                que não são operadas por nós. Não temos controle sobre o
                conteúdo ou práticas desses sites e não nos responsabilizamos
                por suas políticas de privacidade.
              </p>

              <h4 className="text-lg font-semibold">
                4. Consentimento e Recusa
              </h4>
              <p>
                Você é livre para recusar a solicitação de informações pessoais,
                ciente de que isso pode limitar a disponibilidade de alguns
                serviços. O uso contínuo de nossa plataforma será considerado
                como aceitação das nossas práticas de coleta e uso de dados.
              </p>

              <h4 className="text-lg font-semibold">5. Segurança do Site</h4>
              <p>
                O <b>Prol EduPass</b> é monitorado por sistemas confiáveis de
                segurança, incluindo verificações do Google e outras
                ferramentas, assegurando navegação protegida contra ameaças
                conhecidas.
              </p>

              <h4 className="text-lg font-semibold">Política de Cookies</h4>

              <h4 className="text-lg font-semibold">6. O que são Cookies?</h4>
              <p>
                Cookies são pequenos arquivos armazenados em seu dispositivo que
                melhoram a experiência de navegação. Eles permitem que o site
                funcione corretamente e fornecem informações sobre como nossos
                serviços são utilizados.
              </p>

              <h4 className="text-lg font-semibold">
                7. Como Usamos os Cookies
              </h4>
              <p>Utilizamos cookies para:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Gerenciamento de conta e login;</li>
                <li>Processamento de pedidos e serviços;</li>
                <li>Envio de newsletters;</li>
                <li>Execução de pesquisas e formulários;</li>
                <li>Armazenamento de preferências do usuário;</li>
                <li>
                  Coleta de dados analíticos por ferramentas como Google
                  Analytics.
                </li>
              </ul>
              <p>
                Recomendamos manter os cookies ativados, a menos que não deseje
                utilizar determinados recursos da plataforma.
              </p>

              <h4 className="text-lg font-semibold">
                8. Desativação de Cookies
              </h4>
              <p>
                Você pode desativar os cookies diretamente nas configurações do
                navegador. No entanto, essa ação pode comprometer a
                funcionalidade da plataforma.
              </p>
              <p>Guias úteis:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google Chrome</li>
                <li>Mozilla Firefox</li>
                <li>Microsoft Edge</li>
                <li>Opera</li>
                <li>Safari</li>
              </ul>

              <h4 className="text-lg font-semibold">
                9. Tipos de Cookies que Utilizamos
              </h4>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <b>Cookies de Conta:</b> gerenciam cadastro e login.
                </li>
                <li>
                  <b>Cookies de Login:</b> mantêm a sessão ativa entre acessos.
                </li>
                <li>
                  <b>Cookies de Newsletter:</b> verificam inscrições em
                  informativos.
                </li>
                <li>
                  <b>Cookies de Comércio Eletrônico:</b> asseguram o
                  funcionamento de pedidos e transações.
                </li>
                <li>
                  <b>Cookies de Pesquisas:</b> registram participação em
                  questionários.
                </li>
                <li>
                  <b>Cookies de Formulários:</b> armazenam dados inseridos em
                  formulários.
                </li>
                <li>
                  <b>Cookies de Preferências:</b> memorizam configurações e
                  escolhas do usuário.
                </li>
                <li>
                  <b>Cookies de Terceiros:</b> utilizados para análise de
                  navegação e performance, como Google Analytics.
                </li>
              </ul>

              <h4 className="text-lg font-semibold">Compromisso do Usuário</h4>
              <p>
                O usuário se compromete a utilizar a plataforma de forma ética e
                legal, abstendo-se de:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Praticar atos ilícitos ou contrários à ordem pública;</li>
                <li>
                  Difundir conteúdos discriminatórios, ofensivos ou que violem
                  direitos humanos;
                </li>
                <li>
                  Causar danos à plataforma, sistemas, fornecedores ou terceiros
                  por meio de vírus ou softwares maliciosos.
                </li>
              </ul>

              <h4 className="text-lg font-semibold">Mais Informações</h4>
              <p>
                Esta Política busca esclarecer como tratamos suas informações
                pessoais e o uso de cookies. Se houver dúvidas ou necessidade de
                informações adicionais, entre em contato pelos canais oficiais
                disponíveis no site do <b>Prol EduPass</b>.
              </p>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
