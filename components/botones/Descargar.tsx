import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AdBanner from "../anuncios/adBanner";
import { VersionesB_Client } from "@/routes/user.routes";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { Download } from "lucide-react-native";
import { Button } from "../ui/button";

interface DescargasProps {
    idVersion: string;
}

export default function BtnDescargar({ idVersion }: DescargasProps) {
    const socket = useSocket();
    const { session } = useAuth();
    const [descargaHabilitada, setDescargaHabilitada] = useState(false);

    const handleDownload = async () => {
        if (!session?.user.nombre) {
            return alert("Debe iniciar sesión para descargar este archivo.");
        }
        if (socket && session?.user?.id) {
            try {
                const response = await fetch(`${VersionesB_Client}/download/${idVersion}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session.backendTokens.accessToken}`,
                        Refresh: `${session.backendTokens.refreshToken}`,
                        "X-Forwarded-Proto": "https",
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Error al descargar el archivo");
                }

                for (const [key, value] of response.headers.entries()) {
                    console.log(`${key}: ${value}`);
                }

                const blob = await response.blob();
                const contentDisposition = response.headers.get("Content-Disposition");
                const match = contentDisposition?.match(/filename="(.+)"/);
                const filename = match?.[1] || "archivo_descargado";

                // Crear URL del archivo
                const url = window.URL.createObjectURL(blob);

                // Crear elemento temporal <a> para descargar
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();

                // Limpieza
                a.remove();
                window.URL.revokeObjectURL(url);

                socket.emit("Descargado", { version_id: idVersion, usuario_id: session.user.id });

            } catch (error) {
                console.log("Error desconocido al descargar el archivo", error);
            }
        }
    };

    const handleVerAnuncio = () => {
        // Simula esperar que el usuario vea el anuncio (ejemplo: 5 segundos)
        setTimeout(() => {
            setDescargaHabilitada(true);
        }, 5000); // 5 segundos para "simular" el anuncio
    };

    return (
        <>
            {session?.user.id ? (
                // 🚀 DESCARGA DIRECTA SI ES PREMIUM
                <Button
                    className="flex-row items-center justify-center gap-2 cursor-pointer bg-border text-lime-500"
                    onPress={handleDownload}
                >
                    <Download></Download>
                    <Text>Descargar</Text>
                </Button>
            ) : (
                // 📢 DESCARGA CON ANUNCIOS PARA USUARIOS GRATIS
                <View>
                    {!descargaHabilitada ? (
                        <>
                            <Text>Para descargar, por favor mira el anuncio.</Text>
                            <AdBanner adSlot="ID_ANUNCIO_1" />
                            <Button onPress={handleVerAnuncio}>
                                <Text>He visto el anuncio</Text>
                            </Button>
                        </>
                    ) : (
                        <Button
                            className="flex-row items-center justify-center gap-2 cursor-pointer text-lime-500 hover:text-lime-100 transition-all duration-100"
                            onPress={handleDownload}
                        >
                            <Download></Download>
                            <Text>Descargar</Text>
                        </Button>
                    )}
                </View>
            )}
        </>
    );
};