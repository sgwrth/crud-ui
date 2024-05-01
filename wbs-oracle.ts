// Nachkommastellen begrenzen! (Fuer Summen-Output 'Stueckpreis * Anzahl')
function totalSum(int0: number, int1: number): string {
  let sumString: string = (int0 * int1).toString()
  let sumCropped: string = parseFloat(sumString).toFixed(2)
  return sumCropped
}

export { totalSum }