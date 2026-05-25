import { FaArrowRight } from "react-icons/fa";
import logo from "../../public/assets/logos/outline-white.png";
import { Link, useNavigate } from "react-router-dom";

const EdupassLogo = ({
  className = "w-auto h-10",
  textColor = "text-white",
  accentColor = "text-yellow-300",
}) => (
  <div className={`font-bold text-3xl ${className}`}>
    <img src={logo} alt="Logo" className="w-130 cursor-pointer" />
  </div>
);

export default function About() {
  return (
    <section className="bg-[#30ADE7] text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {" "}
          {/*  */}
          {/*  */}
          <div className="text-center md:text-left">
            {/* <h2 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-4">
            Edupass
            </h2>
            <p className="text-xl lg:text-2xl text-[#fffff]">
              Seu passaporte para o futuro pela educação.
            </p> */}
            <EdupassLogo
              className="h-10 md:h-12 mb-8 self-center md:self-start"
              textColor="text-white"
              accentColor="text-yellow-300"
            />
          </div>
          {/* Coluna da Direita: Conteúdo de Texto */}
          <div className="md:pl-4">
            <h3 className="text-sm font-semibold text-[#fffff] uppercase tracking-wider mb-3">
              Quem Somos
            </h3>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
              Sobre o Prol EduPass e a Prol Educa
            </h2>
            <p className="text-lg text-blue-100 mb-4 leading-relaxed">
              O <span className="font-semibold text-white">Prol EduPass</span> é
              uma iniciativa da{" "}
              <span className="font-semibold text-white">Prol Educa</span>,
              nascida da crença no poder transformador da educação. Nossa missão
              é criar pontes entre estudantes, instituições de ensino e
              empresas, facilitando o acesso a bolsas de estudo e oportunidades
              reais de crescimento profissional e pessoal.
            </p>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Acreditamos que aprender muda tudo — e que cada talento merece a
              chance de florescer.
            </p>
            <Link
              to="/portal/quem-somos"
              className="inline-flex items-center gap-2 bg-[#F5F7F8] text-[#2F2F2F] font-semibold px-8 py-3 rounded-lg hover:text-[#30ADE7] transition-colors duration-300 shadow-lg text-base transform hover:scale-105 hover:shadow-[0_4px_12px_#1c8fc3]"
            >
              Conheça a Prol Educa <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
