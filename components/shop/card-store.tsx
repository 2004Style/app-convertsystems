import { diaspasados } from "@/utils/diaspasados";
import { Alert, Image, Text, View } from "react-native";
import { router } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import SVGGlareEffect from "../glareEfect";
import { bg_planesGradient } from "@/utils/bg.clases.planes";
import { preciocondescuento } from "@/utils/preciocondescuento";
import GradientText from "../gradientes/texto";
import { Icon } from "../ui/icon";
const img = require("@/assets/images/icon.png");

export type VersionProps = {
    icon: LucideIcon
    valor: string;
}

export type CardInformacionProps = {
    id: string;
    nombre: string;
    categoria: string;
    precio?: string | null;
    descuento?: string;
    descipcion: string;
    version: VersionProps[];
}

export type CardVentas = CardInformacionProps & { fecha_registro: Date, plan: string | null };
export type CardVentasProps = {
    card: CardVentas;
}

export function CardTienda({ card }: CardVentasProps) {

    const plan = card.plan ?? (Number(card.precio ?? 0) > 0 ? "pago" : "free")

    const diasP = diaspasados(card.fecha_registro)

    const { status } = useAuth();
    const DescuentoAplicado = preciocondescuento(Number(card.precio), Number(card.descuento))

    const handleInformation = () => {
        if (status === "unauthenticated") {
            Alert.alert("para poder ingresar debe estar autenticado");
            return;
        }
        router.replace(`/producto/${card.id}`);
    }

    return (
        <View id={card.id} className="relative flex flex-col gap-4 p-4 shadow-2xl min-w-[290px] w-[100%] box-border rounded bg-white dark:bg-black">
            {/* apartado de descuento */}
            {card.descuento &&
                <View className="absolute -top-2 right-2 overflow-hidden" style={{ width: 90, height: 110, zIndex: 10 }} >
                    <View className=" bg-purple-700 h-[70%]" />
                    <View className="absolute -rotate-[55deg] bg-purple-700 -z-10 translate-y-0 -translate-x-3" style={{ width: 90, height: 90 }} />
                    <View className="absolute rotate-[55deg] bg-purple-700 -z-10 translate-y-0 translate-x-3" style={{ width: 90, height: 90 }} />
                    <Text className="absolute top-0 left-0 flex items-center justify-center font-bold -translate-y-3 text-3xl " style={{ height: '100%', width: '100%', textAlign: "center", verticalAlign: "middle", color: "#eeff77" }}>{card.descuento}%</Text>
                </View>
            }

            {/* apartado de imagen */}
            <View className="relative flex items-center justify-center w-full min-h-45 h-45 overflow-hidden" >
                <Image
                    style={{ height: 224, width: '100%', zIndex: -1 }}
                    source={img}
                    alt="imagen de la empresa"
                />
                {!card.descuento && diasP < 2 &&
                    <Text className="absolute font-bold top-2 right-2 text-xs px-4 py-2 rounded-md">NEW</Text>
                }
            </View>

            {/* apartado de etiqueta de plan */}
            <View className={`absolute -top-2 -left-2 overflow-hidden items-center justify-center`}
                style={{ height: 140, width: 140 }}
            >
                <View className="h-2 w-4 absolute top-0 right-1" style={{ backgroundColor: bg_planesGradient(plan).Color3 }} />
                <View className="h-4 w-2 absolute left-0 bottom-1" style={{ backgroundColor: bg_planesGradient(plan).Color3 }} />
                <SVGGlareEffect clase="z-10 -rotate-45 -translate-y-4 -translate-x-4" plan={plan} />
            </View>

            {/* apartado de informacion */}
            <View className="relative">
                <Text className="text-xl font-extrabold mb-1 text-black dark:text-white">{card.nombre}</Text>
                <GradientText colors={["#ff8c00", "#ff0000"]} texto={card.categoria} fontsize={16} />
                {/* <Text className="text-sm w-min text-emerald-800 font-bold">{card.categoria}</Text> */}
                {card.precio &&
                    <Text className={`text-lg font-bold ${card.descuento ? `text-red-400 line-through` : `text-cyan-600`}`}>${card.precio}</Text>
                }
                {card.descuento &&
                    // <GradientText colors={["#7cfc00", "#ffff00"]} texto={DescuentoAplicado.toString()} fontsize={16} />
                    <Text className="text-lg font-bold text-blue-700">${DescuentoAplicado}</Text>
                }
                <Text className="text-sm mb-4 line-clamp-4 overflow-hidden text-ellipsis text-black dark:text-white">{card.descipcion}</Text>
                <View className="flex flex-row items-center justify-between mb-4">
                    {card.version.map(ver => (
                        <View key={ver.valor} className="flex flex-row items-center gap-1">
                            <Icon as={ver.icon}  />
                            <Text className="text-sm text-black dark:text-white">{ver.valor}</Text>
                        </View>
                    ))}
                </View>

                <Button
                    onPress={handleInformation}
                    className=" w-full bg-blue-500 py-2 rounded-sm"
                >
                    <Text className="text-white font-semibold">
                        Ver Informacion
                    </Text>
                </Button>
            </View >
        </View>
    )
}