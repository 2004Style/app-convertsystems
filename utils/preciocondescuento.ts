export function preciocondescuento(precio: number, porcentaje: number): number {
  if (precio && porcentaje) {
    return Number((precio * (1 - porcentaje / 100)).toFixed(2));
  } else {
    return NaN; // O podrías usar 0 como valor predeterminado.
  }
}
