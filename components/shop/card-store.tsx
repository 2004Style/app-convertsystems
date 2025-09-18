type CardVentas = CardInformacionProps & { fecha_registro: Date, plan: string | null };
type CardVentasProps = {
    card: CardVentas;
}

export function CardTienda({ card }: CardVentasProps) {

    return (
        <View id={card.id} className="relative flex flex-col gap-4 p-4 cursor-default bg-slate-300 text-fr-v-card shadow-lg min-w-[290px] w-[100%] box-border rounded">
            {card.descuento &&
                <CardPorcentaje descuento={card.descuento} />
            }
            <CardImagen fecha_registro={card.fecha_registro} descuento={card.descuento} />
            <CardPlan plan={card.plan ?? (Number(card.precio ?? 0) > 0 ? "pago" : "free")} />
            <CardInformacion
                id={card.id}
                nombre={card.nombre}
                categoria={card.categoria}
                precio={card.precio}
                descuento={card.descuento}
                descipcion={card.descipcion}
                version={card.version}
            />
        </View>
    )
}

export function CardPorcentaje({ descuento }: { descuento: string }) {
    return (
        <View className="absolute -top-2 right-2 overflow-hidden" style={{ width: 90, height: 110 }} >
            <View className=" bg-purple-700 h-[70%]" />
            <View className="absolute -rotate-[55deg] bg-purple-700 -z-10 translate-y-0 -translate-x-3" style={{ width: 90, height: 90 }} />
            <View className="absolute rotate-[55deg] bg-purple-700 -z-10 translate-y-0 translate-x-3" style={{ width: 90, height: 90 }} />
            <Text className="absolute top-0 left-0 flex items-center justify-center font-bold -translate-y-3 text-3xl " style={{ height: '100%', width: '100%', textAlign: "center", verticalAlign: "middle", color: "#eeff77" }}>{descuento}%</Text>
        </View>
    )
}

export function CardPlan({ plan }: { plan: string }) {
    return (
        <View className={`absolute -top-2 -left-2 overflow-hidden items-center justify-center`}
            style={{ height: 140, width: 140 }}
        >
            <View className="h-2 w-4 bg-lime-800 absolute top-0 right-0" />
            <View className="h-4 w-2 bg-lime-800 absolute bottom-0 left-0" />
            <Text className="text-white text-xl text-center -translate-y-4 -translate-x-4 font-bold bg-lime-500 py-2 w-[200%] -rotate-45" style={{ letterSpacing: 3, textTransform: "uppercase" }}>{plan}</Text>
        </View>
    )
}

import { preciocondescuento } from "@/utils/preciocondescuento";

export interface VersionProps {
    icon: LucideIcon
    valor: string;
}

export interface CardInformacionProps {
    id: string;
    nombre: string;
    categoria: string;
    precio?: string | null;
    descuento?: string;
    descipcion: string;
    version: VersionProps[];
}

export function CardInformacion({ id, nombre, categoria, precio, descuento, descipcion, version }: CardInformacionProps) {
    const { status } = useAuth();
    const DescuentoAplicado = preciocondescuento(Number(precio), Number(descuento))

    const handleInformation = () => {
        if (status === "unauthenticated") {
            Alert.alert("para poder ingresar debe estar autenticado");
            return;
        }
        router.replace(`/producto/${id}`);
    }
    return (
        <View className="relative">
            <Text className="text-xl font-semibold mb-1 text-black">{nombre}</Text>
            <Text className="text-sm w-min text-emerald-800 font-bold">{categoria}</Text>
            {precio &&
                <Text className={`text-lg font-bold ${descuento ? `text-red-400 line-through` : `text-cyan-800`}`}>${precio}</Text>
            }
            {descuento &&
                <Text className="text-lg font-bold price-v-card">${DescuentoAplicado}</Text>
            }
            <Text className="text-sm mb-4 line-clamp-4 overflow-hidden text-ellipsis ">{descipcion}</Text>
            <View className="flex flex-row items-center justify-between mb-4">
                {version.map(ver => (
                    <View key={ver.valor} className="flex flex-row items-center gap-1">
                        <ver.icon />
                        <Text className="text-sm ">{ver.valor}</Text>
                    </View>
                ))}
            </View>

            <Button
                onPress={handleInformation}
                // href={`/producto/${id}`}
                className=" w-full bg-blue-500 py-2 rounded-sm"
            >
                <Text className="text-white font-semibold">
                    Ver Informacion
                </Text>
            </Button>
        </View >
    )
}

import { diaspasados } from "@/utils/diaspasados";
import { Alert, Image, Text, View } from "react-native";
import { router } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
const img = require("@/assets/card_background.svg");

interface CardImagenProps {
    fecha_registro: Date;
    descuento?: string;
}

export function CardImagen({ fecha_registro, descuento }: CardImagenProps) {
    const diasP = diaspasados(fecha_registro)
    return (
        <View className="relative flex items-center justify-center w-full min-h-45 h-45 overflow-hidden" >
            <Image
                className="w-full"
                source={img}
                alt="imagen de la empresa"
            />
            {!descuento && diasP < 2 &&
                <Text className="absolute font-bold top-2 right-2 text-xs px-4 py-2 rounded-md">NEW</Text>
            }
        </View>
    )
}