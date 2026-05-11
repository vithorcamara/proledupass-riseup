export function formatBrlCurrency(currency) {
  if (currency === null || currency === undefined || isNaN(currency)) return 'R$ 0,00';

  return Number(currency).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}