import spoletoLogo from "../../assets/spoleto-logo.png";
import bunkerLogo from "../../assets/bunker-logo.png";
import voxLogo from "../../assets/vox-logo.png";

const partners = [
  { name: "SPOLETO", logo: spoletoLogo },
  { name: "BUNKER", logo: bunkerLogo },
  { name: "VOX", logo: voxLogo },
];

export function Partners() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="font-extrabold text-slate-800 mb-10" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          Empresas parceiras do <span className="text-sky-500">Prol Edupass</span>
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
          {partners.map((p) => (
            <img
              key={p.name}
              src={p.logo}
              alt={`Logo ${p.name}`}
              className="h-16 md:h-20 w-40 object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition hover:scale-110 hover:rotate-3 duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
