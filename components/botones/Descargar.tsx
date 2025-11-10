import { useState } from "react";
import { View, Text, Platform } from "react-native";
import AdBanner from "../anuncios/adBanner";
import { VersionesB_Client } from "@/routes/user.routes";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { Download } from "lucide-react-native";
import { Button } from "../ui/button";

interface DescargasProps {
    idVersion: string;
}

export function BtnDescargar({ idVersion }: DescargasProps) {
    const socket = useSocket();
    const { session } = useAuth();
    const [descargaHabilitada, setDescargaHabilitada] = useState(false);
    const [descargando, setDescargando] = useState(false);

    const handleDownload = async () => {
        if (!session?.user.nombre) {
            return alert("Debe iniciar sesión para descargar este archivo.");
        }

        if (!socket || !session?.user?.id) return;

        setDescargando(true);
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

            const blob = await response.blob();
            const contentDisposition = response.headers.get("Content-Disposition");
            const match = contentDisposition?.match(/filename="(.+)"/);
            const filename = match?.[1] || "archivo_descargado";

            if (Platform.OS === "web") {
                // 🌐 DESCARGA WEB - Usar API de navegador
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            } else {
                // 📱 DESCARGA MÓVIL - Usar Share API o Alert
                try {
                    // Convertir blob a base64 usando FileReader
                    const reader = new FileReader();

                    reader.onload = async () => {
                        try {
                            // reader.result es un data URL: "data:application/octet-stream;base64,..."
                            const dataUrl = reader.result as string;

                            // Mostrar opciones al usuario
                            const { Alert } = require('react-native');

                            Alert.alert(
                                '✅ Descarga completada',
                                `El archivo "${filename}" está listo.\n\nTamaño: ${(blob.size / 1024).toFixed(2)} KB`,
                                [
                                    {
                                        text: 'Compartir',
                                        onPress: async () => {
                                            try {
                                                const { Share } = require('react-native');

                                                await Share.share({
                                                    url: dataUrl,
                                                    title: filename,
                                                    message: `Descargar: ${filename}`,
                                                });
                                            } catch (shareError) {
                                                console.log("Error al compartir:", shareError);
                                            }
                                        }
                                    },
                                    {
                                        text: 'Cerrar',
                                        style: 'cancel'
                                    }
                                ]
                            );
                        } catch (readerError) {
                            console.log("Error procesando archivo:", readerError);
                            alert("Error al procesar el archivo");
                        }
                    };

                    reader.onerror = () => {
                        console.log("Error leyendo el blob");
                        alert("Error al leer el archivo");
                    };

                    reader.readAsDataURL(blob);
                } catch (downloadError) {
                    console.log("Error en descarga móvil:", downloadError);
                    alert("Error al descargar el archivo. Por favor, intenta nuevamente.");
                }
            }

            // Emitir evento de descarga
            socket.emit("Descargado", { version_id: idVersion, usuario_id: session.user.id });

        } catch (error) {
            console.log("Error al descargar el archivo", error);
            alert("Error al descargar el archivo");
        } finally {
            setDescargando(false);
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
                    disabled={descargando}
                >
                    <Download></Download>
                    <Text>{descargando ? "Descargando..." : "Descargar"}</Text>
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
                            disabled={descargando}
                        >
                            <Download></Download>
                            <Text>{descargando ? "Descargando..." : "Descargar"}</Text>
                        </Button>
                    )}
                </View>
            )}
        </>
    );
}