import React from "react";
import Footer from "../components/Footer";
import sobreNosImage from "../../public/proleduca.jpg";

export default function AboutUs() {
  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="bg-[#30ADE7] py-12 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Conheça a Prol Educa</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          A Prol Educa é uma startup pernambucana de impacto social que nasceu para transformar vidas por meio da educação. Nosso propósito é claro: derrubar barreiras, abrir portas e criar oportunidades reais para quem mais precisa.
        </p>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-8 py-12 space-y-16">

        {/* SEÇÃO 1 - IMAGEM LATERAL + MISSÃO E PROPÓSITO */}
        <section className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="md:w-1/2">
            <img src={sobreNosImage} alt="Prol Educa" className="rounded-xl shadow-lg w-full object-cover" />
          </div>
          <div className="md:w-1/2 space-y-5">
            <h2 className="text-4xl font-bold text-slate-800">Nossa Missão e Propósito</h2>
            <p className="text-lg leading-relaxed text-slate-600">
              Desde 2015, já mudamos a trajetória de mais de 20 mil alunos em todo o Brasil, oferecendo bolsas de estudo com descontos de até 80% em escolas particulares, cursos técnicos, cursos de idiomas e faculdades.
            </p>
            <p className="text-lg leading-relaxed text-slate-600">
              Para muitas famílias, essa é a primeira chance de ver um filho estudar em uma instituição privada e sonhar com um futuro diferente. Acreditamos que educação de qualidade não deve ser um privilégio — é um direito.
            </p>
          </div>
        </section>

        {/* SEÇÃO 2 - IMPACTO SOCIAL */}
        <section className="space-y-5">
          <h2 className="text-4xl font-bold text-slate-800">Impacto Social e Inclusão</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Cada bolsa que concedemos é mais do que um desconto: é um convite para quebrar ciclos de pobreza, fortalecer comunidades e provar que talento e potencial não têm endereço. Cerca de 80% dos nossos bolsistas pertencem às classes C, D e E, reforçando nosso compromisso com a inclusão e a igualdade de oportunidades.
          </p>
          <p className="text-lg leading-relaxed text-slate-600">
            Já impactamos mais de 20 mil famílias, gerando mais de 5 milhões de reais em receita adicional para nossas instituições parceiras.
          </p>
        </section>

        {/* SEÇÃO 3 - PRESENÇA E EQUIPE */}
        <section className="space-y-5">
          <h2 className="text-4xl font-bold text-slate-800">Presença Nacional e Equipe</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Estamos presentes em 16 estados brasileiros, incluindo Alagoas, Bahia, Ceará, Distrito Federal, Pernambuco, São Paulo, entre outros, consolidando uma equipe comprometida em levar educação de qualidade a todo o país.
          </p>
        </section>

        {/* SEÇÃO 4 - INVESTIMENTOS E CRESCIMENTO */}
        <section className="space-y-5">
          <h2 className="text-4xl font-bold text-slate-800">Investimentos e Reconhecimento</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Iniciamos com recursos próprios, e em 2022, recebemos importantes investimentos de Anjos do Brasil, GV Angels, Investe Favela e Google For Startups – Black Founders Fund. Esses aportes impulsionaram nossa expansão e reforçaram nossa atuação no cenário educacional.
          </p>
          <p className="text-lg leading-relaxed text-slate-600">
            Inspirados por um professor visionário, seguimos firmes no propósito de transformar a educação no Brasil.
          </p>
        </section>

        {/* SEÇÃO 5 - VALORES E COMPROMISSO */}
        <section className="space-y-5">
          <h2 className="text-4xl font-bold text-slate-800">Valores e Compromisso</h2>
          <p className="text-lg leading-relaxed text-slate-600">
            Somos movidos pela coragem, dedicação e foco em resultados, sempre com o objetivo de transformar vidas e realizar sonhos.
          </p>
          <p className="text-lg leading-relaxed text-slate-600 italic text-center">
            Prol Educa – Educação que transforma, oportunidades que mudam destinos.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}
