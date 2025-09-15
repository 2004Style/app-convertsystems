import { NotificarCorreo_Admin } from "@/routes/admin.routes";

/* eslint-disable @typescript-eslint/no-unused-vars */
interface EnviarMailProps {
  destinatario: string;
  asunto: string;
  mensaje: string;
}

export async function EnviarMail({ destinatario, asunto, mensaje }: EnviarMailProps) {
  try {
    const response = await fetch(NotificarCorreo_Admin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-Proto": "https",
      },
      credentials: "include",
      body: JSON.stringify({
        correo: destinatario,
        asunto: asunto,
        mensaje: mensaje,
      }),
    });

    if (!response) {
      console.log("Error");
    }

    const data = await response.json();
    //console.log(data);
  } catch (error) {
    return console.log("error al enviar el correo");
  }
}
