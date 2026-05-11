
import React from 'react';

import { Search, UserPlus, CheckCircle } from "lucide-react";

const SearchIcon = () => (
  <Search className="w-12 h-12 text-[#30ADE7] mb-4" />
);

const UserPlusIcon = () => (
  <UserPlus className="w-12 h-12 text-[#30ADE7] mb-4" />
);

const CheckBadgeIcon = () => (
  <CheckCircle className="w-12 h-12 text-[#30ADE7] mb-4" />
);



export default function Steps() {
  const stepsData = [
    {
      number: 1,
      icon: <SearchIcon />,
      title: "Encontre sua Bolsa",
      description: "Explore as oportunidades disponíveis e escolha a ideal para você ou seus dependentes."
    },
    {
      number: 2,
      icon: <UserPlusIcon />,
      title: "Cadastre-se",
      description: "Crie sua conta e registre os dados do bolsista de forma rápida e fácil."
    },
    {
      number: 3,
      icon: <CheckBadgeIcon />,
      title: "Confirme sua Inscrição",
      description: "Finalize a inscrição, baixe seu contrato e compareça à instituição escolhida."
    }
  ];


  return (
    <section id="comofunciona" className="bg-slate-100 py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-5">
          Como Funciona o Prol EduPass?
        </h2>
        <p className="text-slate-600 mb-12 md:mb-16 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          Conquistar sua bolsa de estudos é um processo simples e transparente. Siga os passos abaixo e dê o próximo grande salto na sua jornada educacional!
        </p>
        
        <div className="relative">
          {/* Linha de conexão para desktop (opcional, visual) */}
          {/* <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0">
            <div className="mx-auto w-[80%] border-t-2 border-dashed border-slate-300"></div>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"> 
            {stepsData.map((step, index) => (
              <div 
                key={step.number} 
                className="bg-white p-6 rounded-xl shadow-xl text-center transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center"
              >
                <div className="relative mb-5">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#30ADE7] text-white font-bold text-2xl shadow-md">
                    {step.number}
                  </div>
          
                </div>
                
                {step.icon} 
                
                <h3 className="text-xl font-semibold text-slate-800 mb-2 mt-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
