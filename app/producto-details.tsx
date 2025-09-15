/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

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
                    requisitos_tecnicos: (JSON.parse(data.requisitos_tecnicos)),
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
                <ScrollView className="min-h-screen bg-background p-8">
                    <View className="max-w-5xl mx-auto space-y-8">
                        <Card className="overflow-hidden">
                            <View className="grid md:grid-cols-2 gap-8 p-8">
                                {/* Product Image */}
                                <View className="relative">
                                    <Image
                                        source={{ uri: "/card_background.svg" }}
                                        alt={producto.nombre}
                                        className="w-full rounded-lg object-cover aspect-square"
                                    />
                                    {producto.plan &&
                                        <Badge
                                            className={`absolute top-4 right-4 ${bg_planes(producto.plan.nombre)}`}
                                        >
                                            {producto.plan.nombre}
                                        </Badge>
                                    }
                                </View>

                                {/* Product Info */}
                                <View className="space-y-6">
                                    <View>
                                        <View className="flex items-center justify-between mb-2">
                                            <Text className="text-3xl font-bold">{producto.nombre}</Text>


                                            {/*botn de like*/}
                                            <BtnLike id={producto.id} like={producto.like} likesCount={producto.likeCount} />
                                        </View>
                                        <View className="flex items-center gap-2 mb-4">
                                            <Badge variant="outline" className="bg-orange-300/10 text-orange-300">{producto.categorias.nombre}</Badge>
                                            {producto.plan &&
                                                <Badge variant="outline" className={bg_planes(producto.plan.nombre)}>
                                                    {producto.plan.nombre}
                                                </Badge>
                                            }
                                        </View>
                                    </View>

                                    <View className="space-y-2">
                                        <View className="flex items-center gap-4">
                                            <Text className="text-3xl font-bold">${producto.precio_actual.precio}</Text>
                                            {producto.versiones.length === 0 && producto.precio && producto.precio > 0 &&
                                                <>
                                                    <Text className="text-xl text-muted-foreground line-through">
                                                        ${producto.precio}
                                                    </Text>
                                                    {producto.versiones.length === 0 && producto.precio_actual.descuento > 0 &&
                                                        <Badge variant="destructive">-{producto.precio_actual.descuento.toFixed(2)}%</Badge>
                                                    }
                                                </>
                                            }
                                        </View>
                                        {producto.versiones.length === 0 &&
                                            <Payment id={producto.id} precio={descuentoAplicado > 0 ? descuentoAplicado.toString() : producto.precio.toString()} comprar={TipodeCompra.producto} classNamebtn="bg-amber-600 cursor-pointer" />

                                            // <BtnComprarProducto id={producto.id} precio={descuentoAplicado > 0 ? descuentoAplicado.toString() : producto.precio.toString()} className="<bg-amber-600 px-4 py-2 rounded-sm> text-amber-50 w-full" />
                                        }
                                    </View>

                                    <View className="grid grid-cols-2 gap-4 text-sm">
                                        <View className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <Text>Released: {formatearFechaParaString(producto.fecha_registro)}</Text>
                                        </View>
                                        <View className="flex items-center gap-2 text-muted-foreground">
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
                            <Text className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                System Requirements
                            </Text>
                            <View className="grid md:grid-cols-2 gap-3">
                                {producto.requisitos_tecnicos.map((req, index) => (
                                    <View key={index} className="flex items-center gap-2 text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-chart-1" />
                                        <Text>{req}</Text>
                                    </View>
                                ))}
                            </View>
                        </Card>

                        {/* Versions */}
                        {producto.versiones.length > 0 &&
                            <Card className="p-6">
                                <Text className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Available Versions
                                </Text>
                                <View className="space-y-4">
                                    {producto.versiones.map((version, index) => (
                                        <Card key={index} className="p-4">
                                            <View className="flex items-center justify-between">
                                                <View className="space-y-1">
                                                    <View className="flex items-center gap-2">
                                                        <Text className="font-semibold">Version {version.numero_version}</Text>
                                                        <Badge variant="outline">{version.size}</Badge>
                                                    </View>
                                                    <Text className="text-sm text-muted-foreground">{version.descripcion_cambios}</Text>
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

