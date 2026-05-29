import BenefitImg from "../../assets/educational-benefits.png";

export function BenefitInfo() {
  return (
    <section className="pt-4 md:pt-8 pb-16 md:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-sky-50 rounded-2xl p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center shadow-lg">
          <img
            src={BenefitImg}
            alt="Criança estudando"
            className="w-full h-72 md:h-96 object-cover rounded-2xl shadow-md"
          />
          <div>
            <h2
              className="font-extrabold text-slate-800 mb-6"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
            >
              Ah, mas esse{" "}
              <span className="text-[#30A9DE]">Benefício Educacional</span>{" "}
              funciona na minha empresa?
            </h2>
            <p className="text-slate-600 mb-4">
              Aqui no Prol Edupass, acreditamos que empresas fortes se constroem
              com oportunidades.
            </p>
            <p className="text-slate-600 mb-4">
              Se você quer oferecer educação de qualidade aos seus
              colaboradores, sem pesar no orçamento, essa é a chance de
              transformar vidas.
            </p>
            <p className="text-slate-600">
              O Prol Edupass foi criado para empresas como a sua — que valorizam
              pessoas e investem no futuro. Com até 80% de desconto e matrícula
              gratuita, seus colaboradores e seus filhos têm acesso a escolas de
              qualidade, promovendo gratidão, retenção e impacto social de
              verdade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
