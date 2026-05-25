import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="bg-[#F1F5F9] min-h-screen flex items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center text-center max-w-2xl w-full">

{/* Título */}
<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-center">
  <span className="text-sky-500">
    Transforme
  </span>{" "}
  
  <span className="text-slate-800">
    o futuro dos
  </span>

  <br />

  <span className="text-slate-800">
    seus colaboradores hoje
  </span>
</h1>

        {/* Texto */}
        <p className="text-slate-500 mt-5 max-w-xl text-sm md:text-base leading-relaxed px-2">
          Com o EduPass, seus colaboradores garantem bolsas de até 80%
          em instituições privadas, com matrícula gratuita — educação
          acessível e transformadora.
        </p>

        {/* Video YouTube */}
        <div className="mt-10 w-full flex justify-center">
          <div className="w-full max-w-[350px] sm:max-w-xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/2Cux0mhiS6s"
              title="Vídeo EduPass"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Botão */}
        <Link
          to="/contratar-beneficio"
          className="mt-8 w-full max-w-[350px] sm:max-w-xl bg-sky-500 text-white font-bold py-4 rounded-xl text-center hover:bg-sky-600 transition"
        >
          CONTRATAR BENEFÍCIO
        </Link>

        {/* Texto inferior */}
        <p className="mt-4 text-sm text-slate-500">
          Já possui Benefício?{" "}
          <Link
            to="/portal/login"
            className="text-sky-500 font-bold hover:underline"
          >
            Clique aqui
          </Link>
        </p>
      </div>
    </section>
  );
}