import { useState, useCallback, memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCosultaApi } from "@/hooks/datosApi.hook";
import { Alert, Text, View } from "react-native";
import { Star } from "lucide-react-native";
import { ReseniasB_Client } from "@/routes/user.routes";
import { Icon } from "./ui/icon";

interface CrearReseniaProps {
    id_user: string;
    id_product: string;
    onReseniaCreada?: () => void;
}

// Componente personalizado para seleccionar estrellas - SIMPLIFICADO
const StarButton = ({
    star,
    isSelected,
    onPress
}: {
    star: number;
    isSelected: boolean;
    onPress: (star: number) => void
}) => {
    return (
        <Button
            key={star}
            onPress={() => onPress(star)}
            className="bg-transparent border-0 rounded-full p-1"
            aria-label={`Calificar con ${star} estrella${star > 1 ? "s" : ""}`}
        >
            <Icon as={Star}
                className={`h-10 w-10 ${isSelected
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                    } `}
            />
        </Button>
    );
};

function CrearReseniaComponent({ id_user, id_product, onReseniaCreada }: CrearReseniaProps) {
    const { post } = useCosultaApi();
    const [calificacion, setCalificacion] = useState<number>(0);
    const [comentario, setComentario] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleCalificacionPress = useCallback((star: number) => {
        setCalificacion(star);
    }, []);

    const handleSubmit = async () => {
        if (calificacion === 0) {
            Alert.alert("Por favor selecciona una calificación", "warning");
            return;
        }

        if (comentario.trim() === "") {
            Alert.alert("Por favor escribe un comentario", "warning");
            return;
        }

        setIsSubmitting(true);

        try {
            const body = {
                usuario_id: id_user,
                producto_id: id_product,
                calificacion: String(calificacion),
                comentario: comentario.trim(),
            }
            const { alert, data } = await post(`${ReseniasB_Client}`, body);

            if (alert === "success") {
                Alert.alert("Reseña enviada correctamente", "success");
                setCalificacion(0);
                setComentario("");
                if (onReseniaCreada) {
                    onReseniaCreada();
                }
            } else {
                Alert.alert(data?.message || "Error al enviar la reseña", "error");
            }
        } catch (error) {
            Alert.alert("Error al enviar la reseña", "error");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="p-6 mb-6 border-2">
            <Text className="text-xl font-semibold mb-4 text-black dark:text-white">Deja tu reseña</Text>
            <View className="space-y-6">
                {/* Rating Selector */}
                <View className="space-y-2">
                    <Label htmlFor="rating" className="text-base font-medium">
                        Calificación
                    </Label>
                    <View className="flex-row flex-wrap items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarButton
                                key={star}
                                star={star}
                                isSelected={star <= calificacion}
                                onPress={handleCalificacionPress}
                            />
                        ))}
                        {calificacion > 0 && (
                            <Text className="ml-2 text-sm text-muted-foreground">
                                ({calificacion} de 5 estrellas)
                            </Text>
                        )}
                    </View>
                </View>

                {/* Comment Input */}
                <View className="space-y-2">
                    <Label htmlFor="comment" className="text-base font-medium">
                        Comentario
                    </Label>
                    <Textarea
                        id="comment"
                        placeholder="Comparte tu experiencia con este producto..."
                        value={comentario}
                        onChangeText={setComentario}
                        className="min-h-[120px] resize-none placeholder:text-black dark:placeholder:text-white"
                        maxLength={500}
                    />
                    <Text className="text-xs text-muted-foreground text-right">
                        {comentario.length}/500 caracteres
                    </Text>
                </View>

                {/* Submit Button */}
                <Button
                    onPress={handleSubmit}
                    disabled={isSubmitting || calificacion === 0 || comentario.trim() === ""}
                    className="w-full bg-amber-600 text-white font-medium"
                >
                    {isSubmitting ? (
                        <Text className="flex items-center gap-2">
                            <Text className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></Text>
                            Enviando...
                        </Text>
                    ) : (
                        <Text>Publicar Reseña</Text>
                    )}
                </Button>
            </View>
        </Card>
    );
}

// Memoizar el componente para evitar re-renders innecesarios del padre
export default memo(CrearReseniaComponent);



