import { GraduationCap, Wallet, FileCheck, Check } from "lucide-react";

const cards = [
  {
    icon: GraduationCap,
    title: "Acesso à educação de qualidade",
    text: "Educação de qualidade com bolsas de estudo de até 80%",
  },
  {
    icon: Wallet,
    title: "Alívio no orçamento familiar",
    text: "Ajude seus colaboradores a economizar com educação e alivie o orçamento familiar",
  },
  {
    icon: FileCheck,
    title: "Matrícula gratuita",
    text: "Seu colaborador estuda com bolsa e ainda tem matrícula 100% gratuita",
  },
];

const reasons = [
  "Para empresas que valorizam o bem-estar dos colaboradores e querem ir além do salário, oferecendo oportunidades reais de crescimento familiar.",
  "Para quem entende que reter talentos começa com cuidado genuíno — e educação de qualidade para os filhos dos colaboradores é o primeiro passo.",
  "Para quem busca cumprir metas de ESG e responsabilidade social de forma concreta, com um benefício acessível e de alto impacto.",
  "Para empresas que querem se destacar no mercado oferecendo um diferencial competitivo que transforma vidas dentro e fora da organização.",
];

export function About_app() {
  return (
    <section className="pt-16 md:pt-24 pb-4 md:pb-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2
            className="font-extrabold text-slate-800 mb-8 min-h-[80px]"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
          >
            Porque meus colaboradores precisam do{" "}
            <span className="text-[#30A9DE]">Prol Edupass</span>?
          </h2>
          <div className="space-y-6">
            {cards.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#30A9DE] flex items-center justify-center mb-4">
                  <Icon className="text-white w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2
            className="font-extrabold text-slate-800 mb-8 min-h-[80px]"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
          >
            Para quais empresas e por que seus colaboradores precisam desses{" "}
            <span className="text-[#30A9DE]">benefícios</span>?
          </h2>
          <ul className="space-y-5">
            {reasons.map((r) => (
              <li
                key={r}
                className="flex items-start gap-4 bg-white border border-slate-100 rounded-xl p-5 shadow-sm"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <Check className="text-green-500 w-5 h-5" />
                </span>
                <span className="text-slate-600 pt-1">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
