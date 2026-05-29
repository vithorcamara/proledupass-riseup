import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axiosInstance";

export default function FiltroCurso({ onBuscar, initialFilters }) {
  const [curso, setCurso] = useState(initialFilters.curso || "");
  const [cursosOptions, setCursosOptions] = useState([]);

  const [instituicao, setInstituicao] = useState(
    initialFilters.instituicao || "",
  );
  const [instituicoesOptions, setInstituicoesOptions] = useState([]);

  const [cidade, setCidade] = useState(initialFilters.cidade || "");
  const [cidadesOptions, setCidadesOptions] = useState([]);

  const [anoBolsa, setAnoBolsa] = useState(initialFilters.anoBolsa || "");
  const [anoBolsaOptions, setAnoBolsaOptions] = useState([]);

  const [bolsa, setBolsa] = useState(initialFilters.bolsa || 80);
  const [tab, setTab] = useState(initialFilters.tab || "Escola");

  const [allData, setAllData] = useState([]);
  const tabs = ["Escola", "Técnico", "Idiomas", "Superior", "Pós"];

  const FilterableSelect = ({ options, value, onChange, placeholder }) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const filteredOptions = options.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase()),
    );

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      const handleEsc = (e) => e.key === "Escape" && setIsOpen(false);
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    return (
      <div ref={wrapperRef} className="relative">
        <input
          type="text"
          value={isOpen ? search : value}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="border border-slate-300 rounded-md px-3 py-2 w-full text-sm text-slate-700 focus:ring-2 focus:ring-[#30ADE7]"
        />
        {isOpen && (
          <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-48 overflow-auto shadow-lg">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-gray-500 text-sm">
                Nenhum resultado
              </li>
            ) : (
              filteredOptions.map((opt, i) => (
                <li
                  key={i}
                  onClick={() => {
                    onChange(opt);
                    setSearch(opt);
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100 text-sm"
                >
                  {opt}
                </li>
              ))
            )}
            {value && (
              <li
                onClick={() => {
                  onChange("");
                  setSearch("");
                  setIsOpen(false);
                }}
                className="px-3 py-2 text-gray-500 text-sm cursor-pointer hover:bg-gray-100 border-t"
              >
                Limpar seleção
              </li>
            )}
          </ul>
        )}
      </div>
    );
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setCurso("");
    setInstituicao("");
    setCidade("");
    setAnoBolsa("");

    onBuscar({
      tab: newTab,
      curso: "",
      instituicao: "",
      cidade: "",
      bolsa,
      anoBolsa: "",
    });
  };

  useEffect(() => {
    axiosInstance
      .get("/courses")
      .then((response) => {
        const datas = response.data;
        const ativos = datas.filter(
          (item) => item?.institutions?.status === true,
        );
        setAllData(ativos);
        atualizarOpcoes(ativos, { tab });
      })
      .catch((err) => console.error("Erro ao carregar cursos:", err));
  }, [tab]);

  useEffect(() => {
    atualizarOpcoes(allData, { curso, instituicao, cidade, anoBolsa, tab });
  }, [curso, instituicao, cidade, anoBolsa, tab]);

  const atualizarOpcoes = (datas, filtros) => {
    if (!datas || datas.length === 0) return;
    const filtrados = datas.filter(
      (item) =>
        item?.institutions?.status === true &&
        item.institutions.type === filtros.tab &&
        (!filtros.curso || item.name === filtros.curso) &&
        (!filtros.instituicao ||
          item.institutions.name === filtros.instituicao) &&
        (!filtros.cidade || item.institutions.city === filtros.cidade) &&
        (!filtros.anoBolsa || item.scholarshipYear === filtros.anoBolsa),
    );

    const cursos = [...new Set(filtrados.map((i) => i.name).filter(Boolean))];
    const instituicoes = [
      ...new Set(filtrados.map((i) => i.institutions.name).filter(Boolean)),
    ];
    const cidades = [
      ...new Set(filtrados.map((i) => i.institutions.city).filter(Boolean)),
    ];
    const anos = [
      ...new Set(filtrados.map((i) => i.scholarshipYear).filter(Boolean)),
    ];

    setCursosOptions(cursos);
    setInstituicoesOptions(instituicoes);
    setCidadesOptions(cidades);
    setAnoBolsaOptions(anos);
  };

  const handleBuscarClick = () => {
    onBuscar({ tab, curso, instituicao, cidade, bolsa, anoBolsa });
  };

  return (
    <div className="relative max-w-6xl mx-auto p-4 px-4 sm:px-6 lg:px-8 bg-white rounded-[24px] shadow-[0_4px_6px_-2px_rgba(0,0,0,0.1)] mt-0 sm:-mt-15 md:-mt-40">
      <div className="p-4 space-y-2">
        <h2 className="text-2xl font-bold text-[#2F2F2F]">
          Vamos procurar uma oportunidade?
        </h2>
        <p className="text-base text-[#757575]">
          Selecione aqui o tipo de ensino, curso, cidade e a instituição que
          deseja estudar!
        </p>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 border-slate-200 mb-6 md:mb-8 w-max">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => handleTabChange(item)}
              className={`w-32 h-12 text-sm font-bold rounded-[100px] transition-colors duration-150 focus:outline-none whitespace-nowrap
                ${
                  tab === item
                    ? "text-[#30ADE7] bg-[#30ADE714]"
                    : "text-slate-500 bg-[#FAFAFA] hover:text-[#30ADE7] hover:bg-[#30ADE714]"
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 mb-6 md:mb-8">
        <div>
          <label className="form-label font-bold text-slate-700">
            Curso desejado
          </label>
          <FilterableSelect
            options={cursosOptions}
            value={curso}
            onChange={setCurso}
            placeholder="Digite ou selecione um curso..."
          />
        </div>

        <div>
          <label className="form-label text-slate-700">
            Instituição (opcional)
          </label>
          <FilterableSelect
            options={instituicoesOptions}
            value={instituicao}
            onChange={setInstituicao}
            placeholder="Digite ou selecione uma instituição..."
          />
        </div>

        <div>
          <label className="form-label text-slate-700">Cidade</label>
          <FilterableSelect
            options={cidadesOptions}
            value={cidade}
            onChange={setCidade}
            placeholder="Digite ou selecione uma cidade..."
          />
        </div>

        <div>
          <label className="form-label text-slate-700">Ano Bolsa</label>
          <FilterableSelect
            options={anoBolsaOptions.map(String)}
            value={anoBolsa}
            onChange={setAnoBolsa}
            placeholder="Digite ou selecione o ano..."
          />
        </div>
      </div>

      {/* Desconto + Buscar */}
      <div className="flex flex-wrap gap-y-6 gap-x-6">
        <div className="flex items-center gap-2 flex-wrap min-w-[250px]">
          <span className="text-sm font-bold text-slate-700 mr-1 sm:mr-2 whitespace-nowrap">
            Desconto até
          </span>
          {[30, 50, 80].map((percent) => (
            <button
              key={percent}
              onClick={() => setBolsa(percent)}
              className={`px-4 py-3 rounded-md font-semibold text-xs sm:text-sm transition-colors duration-150
                ${
                  bolsa === percent
                    ? "bg-[#30ADE7] text-white ring-1 ring-offset-1"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              {percent}%
            </button>
          ))}
        </div>

        <div className="w-full md:w-auto md:ml-auto min-w-[250px]">
          <button
            onClick={handleBuscarClick}
            className="btn bg-[#30ADE7] hover:bg-[#219ed8] cursor-pointer w-full md:auto px-6 py-3 text-white text-sm font-bold shadow-[0_4px_10px_#30ADE7]"
          >
            BUSCAR OPORTUNIDADES
          </button>
        </div>
      </div>
    </div>
  );
}
