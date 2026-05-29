import React from "react";
import Footer from "../components/Footer";
import {
  BadgePercent,
  FileInput,
  UsersRound,
  Library,
  WalletMinimal,
  Building2,
  LifeBuoy,
} from "lucide-react";

const benefits = [
  {
    icon: (
      <BadgePercent
        className="w-full h-full text-[#30ADE7]"
        aria-label="Descontos"
      />
    ),
    title: "Descontos de até 80%",
    description:
      "Descontos nas mensalidades em escolas e faculdades por todo o Brasil, tornando a educação mais acessível para você.",
  },
  {
    icon: (
      <FileInput
        className="w-full h-full text-[#30ADE7]"
        aria-label="Inscrição online"
      />
    ),
    title: "Inscrição 100% online",
    description:
      "Realize sua inscrição de forma simples, rápida e totalmente digital, sem sair de casa.",
  },
  {
    icon: (
      <UsersRound
        className="w-full h-full text-[#30ADE7]"
        aria-label="Cobertura para dependentes"
      />
    ),
    title: "Cobertura para dependentes",
    description:
      "Os benefícios se estendem para seus dependentes, assegurando um futuro educacional sólido para toda a família.",
  },
  {
    icon: (
      <Library
        className="w-full h-full text-[#30ADE7]"
        aria-label="Diversidade de cursos"
      />
    ),
    title: "Diversidade de cursos",
    description:
      "Escolha entre educação básica, técnica, graduação e idiomas, todas com qualidade reconhecida.",
  },
  {
    icon: (
      <WalletMinimal
        className="w-full h-full text-[#30ADE7]"
        aria-label="Isenção da taxa de matrícula"
      />
    ),
    title: "Isenção da taxa de matrícula",
    description:
      "Garantimos isenção da taxa de matrícula, promovendo economia já no primeiro passo.",
  },
  {
    icon: (
      <Building2
        className="w-full h-full text-[#30ADE7]"
        aria-label="Instituições parceiras"
      />
    ),
    title: "+2.000 instituições parceiras",
    description:
      "Nossa ampla rede abrange mais de 2.000 instituições em todo o país, garantindo opções próximas a você.",
  },
  {
    icon: (
      <LifeBuoy
        className="w-full h-full text-[#30ADE7]"
        aria-label="Suporte dedicado"
      />
    ),
    title: "Suporte dedicado",
    description:
      "Conte com uma equipe pronta para auxiliar em cada etapa, garantindo que sua experiência seja tranquila e satisfatória.",
  },
];

export default function Benefits() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <section className="bg-[#30ADE7] py-12 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Benefícios para o Colaborador
        </h1>
        <p className="text-lg md:text-xl">
          Prol EduPass: acesso à educação de qualidade com vantagens reais e
          transformadoras
        </p>
      </section>

      <main className="flex-grow max-w-6xl mx-auto px-6 py-20">
        <section className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
            Oportunidades que transformam vidas
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            Com o <strong>Prol EduPass</strong>, colaboradores têm acesso a
            bolsas com condições exclusivas. Mais que um benefício, um caminho
            seguro para crescimento pessoal, profissional e familiar.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-14">
          {benefits.map(({ icon, title, description }, idx) => (
            <article
              key={idx}
              className="flex items-start gap-8"
              tabIndex={0}
              aria-labelledby={`benefit-title-${idx}`}
              aria-describedby={`benefit-desc-${idx}`}
            >
              <div className="flex items-center justify-center w-16 h-16 flex-shrink-0">
                {icon}
              </div>
              <div>
                <h3
                  id={`benefit-title-${idx}`}
                  className="text-2xl font-semibold text-slate-900"
                >
                  {title}
                </h3>
                <p
                  id={`benefit-desc-${idx}`}
                  className="mt-2 text-slate-700 leading-relaxed"
                >
                  {description}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="text-center mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4 leading-snug">
            Educação acessível desde o início
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed">
            Além dos descontos, o Prol EduPass garante isenção da taxa de
            matrícula, promovendo economia desde o primeiro passo. Investir em
            conhecimento nunca foi tão simples e acessível.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
