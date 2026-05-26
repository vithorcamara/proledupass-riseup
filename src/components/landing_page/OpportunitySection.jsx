
import {
  BookOpen,
  Lock,
  Monitor,
  Users,
  RefreshCw,
  GraduationCap,
} from "lucide-react";

const opportunities = [
  {
    icon: GraduationCap,
    title: "Transformar suas jornadas e de suas famílias",
    description:
      "Receber uma bolsa de estudos é mais do que um benefício — é a chance de mudar histórias por meio da educação de qualidade.",
  },
  {
    icon: BookOpen,
    title: "Acessar ensino de excelência com economia real",
    description:
      "Condições especiais que tornam possível estudar em instituições privadas renomadas, sem comprometer o orçamento familiar.",
  },
  {
    icon: Monitor,
    title: "Viver uma experiência digital simples e acolhedora",
    description:
      "Todo o processo é online, com suporte humano e comunicação transparente em cada etapa.",
  },
  {
    icon: Users,
    title: "Contar com apoio e acompanhamento próximo",
    description:
      "Nossa equipe está presente para orientar e auxiliar colaboradores e gestores sempre que precisarem.",
  },
  {
    icon: RefreshCw,
    title: "Renovar com facilidade e segurança",
    description:
      "As bolsas são renovadas anualmente de forma prática, garantindo continuidade sem surpresas ou custos ocultos.",
  },
  {
    icon: Lock,
    title: "Seguir até a conclusão dos estudos com estabilidade",
    description:
      "O benefício acompanha o aluno até o fim da etapa de ensino, proporcionando tranquilidade e previsibilidade à família.",
  },
];

export function OpportunitySection() {
  return (
    <div className="bg-slate-100 px-16 pt-16 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center mb-12" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
          <span className="text-slate-800">
            Ao ser contemplados, seus colaboradores{" "}
          </span>
          <span className="text-[#30A9DE]">terão a oportunidade de</span>
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {opportunities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Icon */}
                <div className="bg-[#30A9DE] rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
