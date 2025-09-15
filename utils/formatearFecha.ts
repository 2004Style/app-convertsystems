function formatearFechaParaString(fecha?: Date | string) {
  if (!fecha) return "00/00/00";
  const fechaValida = fecha instanceof Date ? fecha : new Date(fecha);
  // Validar si la fecha es válida
  if (isNaN(fechaValida.getTime())) return "Hora no válida";

  return fechaValida.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearHoraParaString(fecha: string | Date | undefined | null): string {
  if (!fecha) {
    return "Hora no disponible"; // Evita errores si el valor es null o undefined
  }

  const fechaValida = fecha instanceof Date ? fecha : new Date(fecha.replace(" ", "T")); // Convierte a Date

  if (isNaN(fechaValida.getTime())) {
    return "Formato de fecha inválido"; // Maneja fechas incorrectas
  }

  return fechaValida.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Usa formato 24h
  });
}

function formatearFechaYHoraParaString(fecha: Date) {
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1); // Restar 1 día para obtener "ayer"

  const esHoy = fecha.getDate() === hoy.getDate() && fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();

  const esAyer = fecha.getDate() === ayer.getDate() && fecha.getMonth() === ayer.getMonth() && fecha.getFullYear() === ayer.getFullYear();

  const formatoLocal = fecha.toLocaleString("es-ES", {
    weekday: esHoy || esAyer ? undefined : "long", // No muestra el día si es hoy o ayer
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Usa formato 24h
  });

  if (esHoy) return `Hoy ${formatoLocal}`;
  if (esAyer) return `Ayer ${formatoLocal}`;

  return formatoLocal; // Para cualquier otro día, muestra el nombre del día
}

export function FechaDescripcionToast(): string {
  const fechaActual = new Date();
  const dia = fechaActual.toLocaleString("es-ES", { weekday: "long" });
  const fecha = fechaActual.toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  const hora = fechaActual.toLocaleString("es-ES", { hour: "2-digit", minute: "2-digit" });

  return `${dia}, ${fecha} at ${hora}`;
}

export function tiempoTranscurridoDesde(fecha: Date | string | undefined | null): string {
  if (!fecha) return "Fecha no disponible";

  const fechaValida = fecha instanceof Date ? fecha : new Date(fecha);
  if (isNaN(fechaValida.getTime())) return "Fecha inválida";

  const ahora = new Date();
  const diferencia = ahora.getTime() - fechaValida.getTime(); // en milisegundos

  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (segundos < 60) return `hace ${segundos} segundo${segundos !== 1 ? "s" : ""}`;
  if (minutos < 60) return `hace ${minutos} minuto${minutos !== 1 ? "s" : ""}`;
  if (horas < 24) return `hace ${horas} hora${horas !== 1 ? "s" : ""}`;
  if (dias < 30) return `hace ${dias} día${dias !== 1 ? "s" : ""}`;

  const meses = Math.floor(dias / 30);
  if (meses < 12) return `hace ${meses} mes${meses !== 1 ? "es" : ""}`;

  const años = Math.floor(meses / 12);
  return `hace ${años} año${años !== 1 ? "s" : ""}`;
}


export { formatearFechaParaString, formatearHoraParaString, formatearFechaYHoraParaString };
