export function enrollmentRenewalDate(registrationDate) {
  if (!registrationDate) return 'N/A';

  const date = new Date(registrationDate);
  date.setFullYear(date.getFullYear() + 1);

  return date.toLocaleDateString('pt-BR');
}