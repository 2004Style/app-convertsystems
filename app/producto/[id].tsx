import { useState, useEffect } from "react";

import { ProductoConRequisitosArray } from "@/interfaces/interfaces";
import { TiendaB_Client } from "@/routes/user.routes";

import BtnLike from "@/components/botones/Like";
import BtnDescargar from "@/components/botones/Descargar";
import { formatearFechaParaString } from "@/utils/formatearFecha";
import { preciocondescuento } from "@/utils/preciocondescuento";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, Tag, Info, CheckCircle2 } from "lucide-react-native";
import { bg_planes } from "@/utils/bg.clases.planes";
import { useCosultaApi } from "@/hooks/datosApi.hook";
import { TipodeCompra } from "@/utils/url-compras";
import Payment from "@/components/payments/payments-methods";
import { Text } from "@/components/ui/text";
import { View, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

// Importa la imagen directamente
const cardBackground = require("@/assets/card_background.svg");

export default function ProductoDetails() {
    const { id } = useLocalSearchParams();
    const { request, sessionStatus } = useCosultaApi();
    const [producto, setProducto] = useState<ProductoConRequisitosArray | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [descuentoAplicado, setDescuentoAplicado] = useState<number>(0);

    useEffect(() => {
        if (sessionStatus !== "authenticated") return;
        const fetchConsulta = async () => {
            const { alert, data } = await request("GET", `${TiendaB_Client}/${id}`);
            setLoading(false);
            if (alert === "success") {
                setProducto({
                    ...data,
                    requisitos_tecnicos: (() => {
                        const rt = data.requisitos_tecnicos;

                        // Caso 1: Si viene como string, lo intentamos parsear
                        if (typeof rt === 'string' && rt.trim() !== '') {
                            try {
                                const parsed = JSON.parse(rt);
                                return Array.isArray(parsed) ? parsed : [parsed]; // ✅ Garantizamos array
                            } catch (error) {
                                console.error("Error al parsear requisitos_tecnicos:", error);
                                return []; // Si falla el JSON, devolvemos array vacío
                            }
                        }

                        // Caso 2: Si ya es array
                        if (Array.isArray(rt)) {
                            return rt;
                        }

                        // Caso 3: Si es objeto, lo envolvemos en un array
                        if (rt && typeof rt === 'object') {
                            return [rt];
                        }

                        // Caso 4: Si es null, undefined o vacío
                        return [];
                    })(),
                });


                const precioDescuento = preciocondescuento(Number(producto?.precio), Number(producto?.productos_ofertas?.[0].ofertas.descuento ?? 0))
                setDescuentoAplicado(precioDescuento)
                //console.log(descuentoAplicado)
                return
            }
            setError("Error al obtener el producto");
        };

        fetchConsulta();
    }, [id, sessionStatus]);

    if (loading) return <Text>Cargando</Text>;
    if (error) return <Text className="text-red-500">{error}</Text>;

    return (
        <>
            {producto && (
                <ScrollView className="relative bg-background p-0 md:p-4">
                    <View className="w-full flex flex-col gap-4 p-4">
                        <Card className="overflow-hidden">
                            <View className="flex flex-col md:flex-row gap-4 p-4">
                                {/* Product Image */}
                                <View className="relative">
                                    <Image
                                        source={cardBackground}
                                        alt={producto.nombre}
                                        className="w-full rounded-lg aspect-square"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            aspectRatio: 1,
                                            borderRadius: 8,
                                            resizeMode: 'cover'
                                        }}
                                    />
                                    <View className="absolute bottom-2 right-2">
                                        <BtnLike id={producto.id} like={producto.like} likesCount={producto.likeCount} />
                                    </View>
                                    {producto.plan &&
                                        <Badge
                                            className={`absolute top-4 right-4 ${bg_planes(producto.plan.nombre)}`}
                                        >
                                            <Text>
                                                {producto.plan.nombre}
                                            </Text>
                                        </Badge>
                                    }
                                </View>

                                {/* Product Info */}
                                <View className="space-y-6">
                                    <View className="relative">
                                        <Text className="text-3xl font-bold">{producto.nombre}</Text>
                                        <View className="flex-row items-center gap-2 mb-4">
                                            <Badge variant="outline" className="bg-orange-300/10 text-orange-300">{producto.categorias.nombre}</Badge>
                                            {producto.plan &&
                                                <Badge variant="outline" className={bg_planes(producto.plan.nombre)}>
                                                    <Text>
                                                        {producto.plan.nombre}
                                                    </Text>
                                                </Badge>
                                            }
                                        </View>
                                    </View>

                                    <View className="space-y-2">
                                        <View className="flex-row items-center gap-4">
                                            <Text className="text-3xl font-bold">${producto.precio_actual.precio}</Text>
                                            {producto.versiones.length === 0 && producto.precio && producto.precio > 0 &&
                                                <>
                                                    <Text className="text-xl text-muted-foreground line-through">
                                                        ${producto.precio}
                                                    </Text>
                                                    {producto.versiones.length === 0 && producto.precio_actual.descuento > 0 &&
                                                        <Badge variant="destructive">
                                                            <Text>
                                                                -{producto.precio_actual.descuento.toFixed(2)}%
                                                            </Text>
                                                        </Badge>
                                                    }
                                                </>
                                            }
                                        </View>
                                        {producto.versiones.length === 0 &&
                                            <Payment id={producto.id} precio={descuentoAplicado > 0 ? descuentoAplicado.toString() : producto.precio.toString()} comprar={TipodeCompra.producto} classNamebtn="bg-amber-600 cursor-pointer" />

                                            // <BtnComprarProducto id={producto.id} precio={descuentoAplicado > 0 ? descuentoAplicado.toString() : producto.precio.toString()} className="<bg-amber-600 px-4 py-2 rounded-sm> text-amber-50 w-full" />
                                        }
                                    </View>

                                    <View className="flex flex-col md:flex-row gap-4 text-sm">
                                        <View className="flex-row items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <Text>Released: {formatearFechaParaString(producto.fecha_registro)}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-2 text-muted-foreground">
                                            <Tag className="h-4 w-4" />
                                            <Text>Category: {producto.categorias.nombre}</Text>
                                        </View>
                                    </View>

                                    <View className="space-y-4">
                                        <Text className="text-lg font-semibold">Description</Text>
                                        <Text className="text-muted-foreground">{producto.descripcion}</Text>
                                    </View>
                                </View>
                            </View>
                        </Card>

                        {/* Requirements */}
                        <Card className="p-6">
                            <View className="flex-row flex-nowrap text-nowrap text-xl font-semibold items-center gap-2">
                                <Info />
                                <Text>System Requirements</Text>
                            </View>
                            <View className="grid md:grid-cols-2 gap-3">
                                {producto.requisitos_tecnicos.map((req, index) => (
                                    <View key={index} className="flex-row items-center gap-2 text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-chart-1" />
                                        <Text>{req}</Text>
                                    </View>
                                ))}
                            </View>
                        </Card>

                        {/* Versions */}
                        {producto.versiones.length > 0 &&
                            <Card className="p-2 md:p-6">
                                <View className="text-xl font-semibold flex-row items-center gap-2">
                                    <Package />
                                    <Text>Available Versions</Text>
                                </View>
                                <View className="space-y-2">
                                    {producto.versiones.map((version, index) => (
                                        <Card key={index} className="p-2">
                                            <View className="flex flex-row items-center justify-between">
                                                <View className="flex flex-col md:flex-row space-y-1">
                                                    <View className="flex-row items-center gap-2">
                                                        <Text className="font-semibold">Version {version.numero_version}</Text>
                                                        <Badge variant="outline">
                                                            <Text>
                                                                {version.size}
                                                            </Text>
                                                        </Badge>
                                                    </View>
                                                    {/* <Text className="text-sm text-muted-foreground">{version.descripcion_cambios}</Text> */}
                                                    <Text className="text-sm text-muted-foreground">Released: {formatearFechaParaString(version.fecha_lanzamiento)}</Text>
                                                </View>
                                                < BtnDescargar idVersion={producto.versiones?.[0].id} />
                                            </View>
                                        </Card>
                                    ))}
                                </View>
                            </Card>
                        }
                    </View>
                </ScrollView>
            )}
        </>
    );
}

