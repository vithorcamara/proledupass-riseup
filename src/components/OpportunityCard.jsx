// src/components/OpportunityCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

import { MapPin, Clock } from "lucide-react";

const MapPinIcon = () => <MapPin className="w-4 h-4 mr-1 inline-block" />;
const ClockIcon = () => <Clock className="w-4 h-4 mr-1 inline-block" />;



export default function OpportunityCard({
  id,
  logoUrl,
  institution,
  course,
  turno,
  city,
  state,
  originalPrice,
  discountedPrice,
  percent,
}) {
  const locationString = [city, state].filter(Boolean).join(', ');

  return (
    <Link
      to={`/bolsa/${id}`}
      className="block group rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
      aria-label={`Ver detalhes da bolsa para ${course} na ${institution}`}
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-xl h-full flex flex-col overflow-hidden transform group-hover:-translate-y-1 group-focus:-translate-y-1 transition-all duration-300 ease-in-out">
        
        {/* Imagem/Logo da Instituição e Selo de Desconto */}
        <div className="relative">
          <div className="w-full h-32 bg-slate-100 flex items-center justify-center overflow-hidden">
            <img
              src={logoUrl || 'https://via.placeholder.com/250x100/E2E8F0/94A3B8?text=Logo'}
              alt={`Logo da ${institution || 'Instituição'}`}
              className="max-h-full max-w-full object-contain p-2"
            />
          </div>
          {percent && (
            <span className="absolute top-2 right-3 bg-[#F15050] text-white text-xs font-semibold px-2.5 py-1 rounded-[8px] shadow-md">
              {percent} de desconto
            </span>
          )}
        </div>

        {/* Conteúdo Principal do Card */}
        <div className="p-5 flex flex-col flex-grow">
          <div>
          <h3 className="text-lg font-semibold text-slate-800 leading-tight mb-1 group-hover:text-[#30ADE7] transition-colors duration-200 mb-3 line-clamp-2">
            {/* h-14 e line-clamp-2 para garantir altura consistente e evitar quebra de layout com nomes longos */}
            {course || 'Nome do Curso Indisponível'}
          </h3>
          <p className="text-slate-500 mb-3 text-[16px] text-[#A8A8A8] truncate mb-6">
            {institution || 'Instituição Indisponível'}
          </p>
          </div>

          {/* Detalhes como Turno e Localização */}
          <div className="space-y-1.5 text-xs text-slate-600 mb-4">
            {turno && (
              <div className="flex items-center">
                <ClockIcon />
                <span className='text-[#A8A8A8]'>{turno}</span>
              </div>
            )}
            {locationString && (
              <div className="flex items-center">
                <MapPinIcon />
                <span className="truncate text-[#A8A8A8]">{locationString}</span>
              </div>
            )}
          </div>
          
          {/* Preços - Empurrado para o final do flex-grow */}
          <div className="mt-auto pt-4">
            {originalPrice && originalPrice.trim() !== "-" && (
              <p className="text-slate-400 text-xs line-through text-right">
                De: {originalPrice}
              </p>
            )}
            {discountedPrice && (
              <p className="text-2xl font-bold text-[#30ADE7] text-right">
                {discountedPrice}
              </p>
            )}
            {discountedPrice && (
             <p className="text-xs text-slate-500 text-right mt-0.5">
              na mensalidade
            </p>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
}