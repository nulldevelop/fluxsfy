/**
 * Converte um valor monetário em reais (BRL) para centavos.
 * @param {string} amout - O valor monetário em reais (BRL) a ser convertido. 
 * @returns {number} o valor convertido em centavos. 
 */
export function convertRealToCents(amout: string) {
  const numericPrice = Number.parseFloat(
    amout.replace(/\./g, '').replace(',', '.')
  )
  const priceInCents = Math.round(numericPrice * 100)

  return priceInCents
}
