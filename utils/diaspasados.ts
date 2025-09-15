export function diaspasados(fecha: string | Date): number {
  const fechaConvertida = typeof fecha === "string" ? new Date(fecha) : fecha;
  const fechaActual = new Date();
  const diferencia = fechaActual.getTime() - fechaConvertida.getTime();
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

  // console.log(`Han pasado ${dias} días.`);
  return dias;
}
