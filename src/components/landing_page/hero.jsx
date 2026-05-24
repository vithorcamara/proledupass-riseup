import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="bg-[#F1F5F9] min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-2xl w-full">
        
        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          <span className="text-sky-500">
            Transforme
          </span>
          <br />
          <span className="text-slate-800">
            o futuro dos seus colaboradores hoje
          </span>
        </h1>

        {/* Texto */}
        <p className="text-slate-500 mt-4 max-w-lg text-sm md:text-base">
          Com o EduPass, seus colaboradores ganham acesso
          ao ensino privado com matrícula gratuita
          educação acessível e transformadora.
        </p>

        {/* Card Imagem */}
        <div className="mt-12 w-full relative group">
          {/* Efeito de brilho/glow ao fundo */}
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-sky-200 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white">
            <img
              src="public/assets/banners/banner-eduPass-mobile.png"
              alt="Hero EduPass"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Botão */}
        <Link 
          to="/LP/contract-benefit"
          className="mt-8 bg-sky-500 hover:bg-sky-600 transition-all transform hover:scale-105 text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-sky-200 inline-block"
        >
          CONTRATAR BENEFÍCIO
        </Link>
      </div>
    </section>
  );
}