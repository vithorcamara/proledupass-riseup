export function filtrarOportunidades(oportunidades, filtros) {
  // console.log('oportunidades:', oportunidades);
  // console.log('filtros: ', filtros)

  if (!oportunidades || !Array.isArray(oportunidades)) return [];
  if (!filtros) return oportunidades;

  const normalizedFiltros = {
    ...filtros,
    anoBolsa: filtros.anoBolsa ? filtros.anoBolsa.toString() : "",
    tab: filtros.tab ? filtros.tab.toLowerCase() : "",
    curso: filtros.curso ? filtros.curso.toLowerCase().trim() : "",
    instituicao: filtros.instituicao
      ? filtros.instituicao.toLowerCase().trim()
      : "",
    cidade: filtros.cidade ? filtros.cidade.toLowerCase().trim() : "",
    bairro: filtros.bairro ? filtros.bairro.toLowerCase().trim() : "",
  };

  // console.log('normalizedFiltros:', normalizedFiltros)

  return oportunidades.filter((item) => {
    const tabSelecionadaLower = normalizedFiltros.tab;
    // const isEscolaTab = tabSelecionadaLower === 'escola';

    // const modalidadeMatch = true;

    let bolsaPercentMatch = true;
    if (typeof normalizedFiltros.bolsa === "number" && item.percent) {
      const bolsaValorItem = parseInt(
        String(item.percent).replace(/[^\d]/g, ""),
      );
      bolsaPercentMatch = !isNaN(bolsaValorItem)
        ? bolsaValorItem <= normalizedFiltros.bolsa
        : false;
    }

    let tabMatch = true;
    const tipoInstituicaoLower = item.institutionType?.toLowerCase();
    if (tabSelecionadaLower) {
      tabMatch = tipoInstituicaoLower === tabSelecionadaLower;
    }

    let inputCursoMatch = true;
    let inputInstituicaoMatch = true;
    let inputLocalizacaoMatch = true;
    let inputAnoBolsa = true;

    // if (isEscolaTab) {

    //   if (normalizedFiltros.curso) {
    //     inputCursoMatch = item.course && item.course.toLowerCase().includes(normalizedFiltros.curso);
    //   }

    //   if (normalizedFiltros.instituicao) {
    //     inputInstituicaoMatch = item.institution && item.institution.toLowerCase().includes(normalizedFiltros.instituicao);
    //   }

    //   inputLocalizacaoMatch = true;

    // } else {

    //   if (normalizedFiltros.curso) {
    //     inputCursoMatch = item.course && item.course.toLowerCase().includes(normalizedFiltros.curso);
    //   }

    //   if (normalizedFiltros.instituicao) {
    //     inputInstituicaoMatch = item.institution && item.institution.toLowerCase().includes(normalizedFiltros.instituicao);
    //   }

    //   if (normalizedFiltros.cidade) {
    //     const cityMatch = item.city && item.city.toLowerCase().includes(normalizedFiltros.cidade);
    //     const stateMatch = item.state && item.state.toLowerCase() === normalizedFiltros.cidade; // Exact match for state abbreviation
    //     inputLocalizacaoMatch = cityMatch || stateMatch;
    //   }
    // }

    if (normalizedFiltros.curso) {
      inputCursoMatch =
        item.course &&
        item.course.toLowerCase().includes(normalizedFiltros.curso);
    }

    if (normalizedFiltros.instituicao) {
      inputInstituicaoMatch =
        item.institution &&
        item.institution.toLowerCase().includes(normalizedFiltros.instituicao);
    }

    if (normalizedFiltros.cidade) {
      const cityMatch =
        item.city && item.city.toLowerCase().includes(normalizedFiltros.cidade);
      const stateMatch =
        item.state && item.state.toLowerCase() === normalizedFiltros.cidade; // Exact match for state abbreviation
      inputLocalizacaoMatch = cityMatch || stateMatch;
    }

    if (normalizedFiltros.anoBolsa) {
      inputAnoBolsa =
        item.scholarshipYear &&
        item.scholarshipYear.toString() === normalizedFiltros.anoBolsa;
    }

    return (
      inputCursoMatch &&
      inputInstituicaoMatch &&
      inputLocalizacaoMatch &&
      bolsaPercentMatch &&
      inputAnoBolsa &&
      // modalidadeMatch &&
      tabMatch
    );
  });
}
