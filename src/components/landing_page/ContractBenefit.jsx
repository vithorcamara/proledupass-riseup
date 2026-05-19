import { useState } from "react";
import { Check } from "lucide-react";

export function ContractBenefit({ onBack }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition";
  const labelClass = "block font-semibold text-slate-800 mb-2";

  return (
    <div className="min-h-screen bg-sky-500 py-10 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md p-6 md:p-12"
        >
          <h1 className="font-extrabold text-slate-800 mb-2" style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)" }}>
            Contratar Benefício
          </h1>
          <p className="text-slate-600 mb-8">
            Preencha os dados da sua empresa para começar a transformar o futuro dos seus colaboradores.
          </p>

          <section className="mb-8">
            <h2 className="font-bold text-slate-800 mb-5">Dados da Empresa</h2>

            <div className="mb-5">
              <label className={labelClass}>Nome da Empresa *</label>
              <input required type="text" placeholder="Digite o nome da empresa" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>CNPJ *</label>
                <input required type="text" placeholder="00.000.000/0000-00" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Telefone *</label>
                <input required type="tel" placeholder="(00) 00000-0000" className={inputClass} />
              </div>
            </div>

            <div className="mb-5">
              <label className={labelClass}>E-mail Corporativo *</label>
              <input required type="email" placeholder="contato@empresa.com.br" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Número de Colaboradores *</label>
              <select required defaultValue="" className={`${inputClass} bg-sky-50`}>
                <option value="" disabled>Selecione</option>
                <option value="1-50">1 a 50</option>
                <option value="51-200">51 a 200</option>
                <option value="201-500">201 a 500</option>
                <option value="501-1000">501 a 1.000</option>
                <option value="1000+">Mais de 1.000</option>
              </select>
            </div>
          </section>

          <hr className="border-slate-100 my-8" />

          <section className="mb-8">
            <h2 className="font-bold text-slate-800 mb-5">Dados do Responsável</h2>

            <div className="mb-5">
              <label className={labelClass}>Nome Completo *</label>
              <input required type="text" placeholder="Digite seu nome completo" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Cargo *</label>
                <input required type="text" placeholder="Ex: Gerente de RH" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Telefone *</label>
                <input required type="tel" placeholder="(00) 00000-0000" className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>E-mail *</label>
              <input required type="email" placeholder="seu.email@empresa.com.br" className={inputClass} />
            </div>
          </section>

          <hr className="border-slate-100 my-8" />

          <section className="mb-8">
            <h2 className="font-bold text-slate-800 mb-5">Informações Adicionais</h2>
            <label className={labelClass}>Mensagem (opcional)</label>
            <textarea
              rows={4}
              placeholder="Conte-nos mais sobre suas necessidades e expectativas..."
              className={inputClass}
            />
          </section>

          <p className="text-center text-slate-600 mb-6 max-w-xl mx-auto">
            Aceito os termos de uso e política de privacidade e autorizo o contato da equipe Prol Edupass para mais informações sobre o benefício.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onBack}
              className="border border-slate-200 text-slate-800 rounded-xl py-3 font-semibold hover:bg-slate-50 transition"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-3 font-semibold transition shadow-sm"
            >
              {submitted ? "Solicitação Enviada!" : "Enviar Solicitação"}
            </button>
          </div>
        </form>

        <aside className="bg-sky-50 rounded-2xl p-6 md:p-8 mt-8">
          <h3 className="font-bold text-slate-800 mb-4">O que acontece depois?</h3>
          <ul className="space-y-2">
            {[
              "Nossa equipe entrará em contato em até 24 horas úteis",
              "Apresentaremos um plano personalizado para sua empresa",
              "Você poderá começar a oferecer o benefício em poucos dias",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sky-700">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}