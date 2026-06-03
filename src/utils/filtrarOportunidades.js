const normalizarTipo = (value) =>
  String(value || "")
    .replace(/\u00c3\u0192\u00c2\u00a9/g, "e")
    .replace(/\u00c3\u0192\u00c2\u00b3/g, "o")
    .replace(/\u00c3\u00a9/g, "e")
    .replace(/\u00c3\u00b3/g, "o")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function filtrarOportunidades(oportunidades, filtros) {
  if (!oportunidades || !Array.isArray(oportunidades)) {
    return [];
  }

  if (!filtros) {
    return oportunidades;
  }

  const normalizedFiltros = {
    ...filtros,
    anoBolsa: filtros.anoBolsa ? filtros.anoBolsa.toString() : "",
    tab: filtros.tab ? normalizarTipo(filtros.tab) : "",
    curso: filtros.curso ? filtros.curso.toLowerCase().trim() : "",
    instituicao: filtros.instituicao
      ? filtros.instituicao.toLowerCase().trim()
      : "",
    cidade: filtros.cidade ? filtros.cidade.toLowerCase().trim() : "",
    bairro: filtros.bairro ? filtros.bairro.toLowerCase().trim() : "",
  };

  return oportunidades.filter((item) => {
    let inputCursoMatch = true;
    let inputInstituicaoMatch = true;
    let inputLocalizacaoMatch = true;
    let inputAnoBolsaMatch = true;
    let bolsaPercentMatch = true;
    let tabMatch = true;

    // Filtro por curso
    if (normalizedFiltros.curso) {
      inputCursoMatch =
        item.course &&
        item.course.toLowerCase().includes(normalizedFiltros.curso);
    }

    // Filtro por instituição
    if (normalizedFiltros.instituicao) {
      inputInstituicaoMatch =
        item.institution &&
        item.institution.toLowerCase().includes(
          normalizedFiltros.instituicao
        );
    }

    // Filtro por cidade
    if (normalizedFiltros.cidade) {
      const cityMatch =
        item.city &&
        item.city.toLowerCase().includes(normalizedFiltros.cidade);

      const stateMatch =
        item.state &&
        item.state.toLowerCase() === normalizedFiltros.cidade;

      inputLocalizacaoMatch = cityMatch || stateMatch;
    }

    // Filtro por ano da bolsa
    if (normalizedFiltros.anoBolsa) {
      inputAnoBolsaMatch =
        item.scholarshipYear &&
        item.scholarshipYear.toString() ===
          normalizedFiltros.anoBolsa;
    }

    // Filtro por porcentagem da bolsa
    if (
      normalizedFiltros.bolsa &&
      Number(normalizedFiltros.bolsa) > 0 &&
      item.percent
    ) {
      const bolsaValorItem = parseInt(
        String(item.percent).replace(/[^\d]/g, ""),
        10
      );

      if (!isNaN(bolsaValorItem)) {
        bolsaPercentMatch =
          bolsaValorItem === Number(normalizedFiltros.bolsa);
      }
    }

    // Filtro por tipo (Escola, Superior etc.)
    if (normalizedFiltros.tab) {
      const itemType = normalizarTipo(item.institutionType);
      const filterTab = normalizarTipo(normalizedFiltros.tab);
      
      // Se houver uma aba selecionada, o tipo deve bater exatamente
      tabMatch = filterTab === "todos" || itemType === filterTab;
    }

    return (
      inputCursoMatch &&
      inputInstituicaoMatch &&
      inputLocalizacaoMatch &&
      inputAnoBolsaMatch &&
      bolsaPercentMatch &&
      tabMatch
    );
  });
}
