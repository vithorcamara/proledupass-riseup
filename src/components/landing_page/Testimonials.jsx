import juliana from "/src/assets/testimonial-imgs/juliana.png";
import carlos from "/src/assets/testimonial-imgs/carlos.png";
import renata from "/src/assets/testimonial-imgs/renata.png";
import daniela from "/src/assets/testimonial-imgs/daniela.png";
import thiago from "/src/assets/testimonial-imgs/thiago.png";
import patricia from "/src/assets/testimonial-imgs/patricia.png";

const people = [
  {
    name: "Juliana M.",
    img: juliana,
    text: "Graças a Deus, ao Prol Edupass e à minha empresa, meu filho entrou na escola dos nossos sonhos!",
  },
  {
    name: "Carlos Henrique",
    img: carlos,
    text: "Nunca imaginei poder pagar uma escola tão boa. O benefício fez toda a diferença pra gente.",
  },
  {
    name: "Renata Silva",
    img: renata,
    text: "O Prol Edupass foi um presente. Minha filha ama a escola nova, e eu pago muito menos.",
  },
  {
    name: "Daniela Rocha",
    img: daniela,
    text: "Com a bolsa do Prol Edupass, consegui tirar meus dois filhos da escola pública. Gratidão!",
  },
  {
    name: "Thiago A.",
    img: thiago,
    text: "Minha empesa nos deu esse benefício e mudou nossa vida. Educação de verdade pro meu filho.",
  },
  {
    name: "Patrícia Souza",
    img: patricia,
    text: "O Prol Edupass facilitou tudo: matrícula gratuita, desconto alto e escola excelente. Só tenho a agradecer!",
  },
];

export function Testimonials() {
  return (
    <section className="pt-8 pb-8 md:pt-12 md:pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2
          className="font-extrabold text-slate-800 text-center mb-2"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
        >
          Palavras de quem já{" "}
          <span className="text-[#30A9DE]">transformou </span>
          seu futuro
        </h2>
        <p className="text-center text-slate-600 mb-8">
          Confira o que colaboradores dizem após conquistarem bolsas com o Prol
          Edupass
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((p) => (
            <article
              key={p.name}
              className="bg-slate-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={p.img}
                alt={p.name}
                className="w-20 h-20 object-cover mx-auto mb-4 border-white shadow rounded-md"
              />
              <h3 className="font-bold text-slate-800 mb-3">{p.name}</h3>
              <p className="text-slate-600 italic">“{p.text}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
