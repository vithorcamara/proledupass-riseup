import React, { useState } from 'react';

export function FAQ() {
 
  const [openIndex, setOpenIndex] = useState(-1);

  const faqData = [
    {
      question: "O que é o Prol EduPass?",
      answer: "O Prol EduPass é um benefício educacional que conecta colaboradores e seus dependentes a bolsas de até 80% em instituições privadas de ensino, com matrícula gratuita."
    },
    {
      question: "Qual é a missão do Prol EduPass?",
      answer: "Promover inclusão e impacto social através da educação, oferecendo às empresas uma forma simples e acessível de transformar a vida de seus colaboradores."
    },
    {
      question: "Quem pode ser beneficiado com as bolsas de estudo?",
      answer: "Todos os colaboradores das empresas parceiras e, dependendo da política da organização, seus filhos e dependentes diretos."
    },
    {
      question: "Como o colaborador se inscreve?",
      answer: "Após a empresa aderir ao benefício, o colaborador realiza o cadastro na plataforma Prol EduPass e escolhe a instituição de ensino disponível, com suporte em todas as etapas."
    },
    {
      question: "Existe taxa de adesão?",
      answer: "Na maioria dos casos, não há custo de adesão para o colaborador. As condições são personalizadas e definidas junto à empresa contratante."
    },
    {
      question: "Como funciona a renovação da bolsa?",
      answer: "A renovação é anual e feita de forma simples, garantindo que o colaborador mantenha as condições do benefício durante todo o período letivo."
    }
  ];

  const toggleDropdown = (index) => {
    // Se clicar no que já está aberto, fecha. Se não, abre o novo.
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-8 md:py-12 bg-white px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Título da Seção */}
      <div className="max-w-3xl w-full text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">
          Dúvidas <span className="text-sky-500">Frequentes</span>
        </h2>
        <p className="text-slate-600">Esclareça os principais pontos sobre o nosso benefício</p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index} 
              className="bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md"
            >
              {/* Botão da Pergunta */}
              <button
                onClick={() => toggleDropdown(index)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center focus:outline-none group"
              >
                <span className={`font-bold text-lg leading-snug pr-4 transition-colors duration-300 ${isOpen ? 'text-sky-500' : 'text-slate-800'}`}>
                  {item.question}
                </span>
                
                {/* Ícone de Seta (Gira 180° quando aberto) */}
                <svg
                  className={`w-5 h-5 transform transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 text-sky-500' : 'text-slate-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Corpo da Resposta (Animação de Dropdown) */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 text-slate-600 text-base leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}