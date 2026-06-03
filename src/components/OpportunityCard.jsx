import React from "react";
import { Link } from "react-router-dom";

export default function OpportunityCard({
  id,
  institution,
  course,
  city,
  state,
  originalPrice,
  discountedPrice,
  percent,
}) {
  return (
    <Link to={`/portal/bolsa/${id}`} className="block group">
      <div className="bg-white rounded-md border border-slate-100 px-9 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
        <span className="inline-flex h-5 items-center rounded-sm bg-[#08b9d6] px-2 text-[10px] font-bold uppercase text-white">
          {percent} OFF
        </span>

        <div className="mt-4">
          <h3 className="min-h-[34px] text-sm font-bold leading-[17px] text-slate-700 line-clamp-2">
            {course}
          </h3>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {institution}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {city} - {state}
          </p>

          <div className="my-4 border-t border-slate-100" />

          <p className="text-[10px] font-medium text-slate-400 line-through">
            {originalPrice}
          </p>

          <p className="mt-0.5 text-xl font-extrabold leading-none text-[#08b9d6]">
            {discountedPrice}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            por mes
          </p>

          <div className="mt-4 flex h-9 w-full items-center justify-center rounded bg-[#08b9d6] text-xs font-bold text-white transition-colors group-hover:bg-[#079fba]">
            Ver detalhes
          </div>
        </div>
      </div>
    </Link>
  );
}
