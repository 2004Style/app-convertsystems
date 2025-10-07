import { useState, useEffect } from "react";
import { Ventas } from "@/interfaces/interfaces";
import { DetailsCompraB_Client } from "@/routes/user.routes";
import { useCosultaApi } from "@/hooks/datosApi.hook";
import { Text } from "@/components/ui/text";
import { View, ScrollView, RefreshControl } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { AppLayout } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProductoDetails() {
    const { id } = useLocalSearchParams();
    const { get, sessionStatus } = useCosultaApi();
    const [details, setDetails] = useState<Ventas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDetails = async () => {
        if (sessionStatus !== "authenticated") return;
        const fetchConsulta = async () => {
            const { alert, data } = await get(`${DetailsCompraB_Client}/${id}`);
            setLoading(false);
            setRefreshing(false);
            if (alert === "success") {
                setDetails(data);
                return
            }
            setError("Error al obtener el producto");
        };

        fetchConsulta();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setError(null);
        await fetchDetails();
    };

    useEffect(() => {
        if (sessionStatus !== "authenticated") return;
        fetchDetails();
    }, [id, sessionStatus]);

    const renderContent = () => {
        if (loading) return <Text>Cargando</Text>;
        if (error) return <Text className="text-red-500">{error}</Text>;
        return (
            details && (
                <View className="flex-1 p-4">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <View className="flex-row items-center justify-between mb-2">
                                <CardTitle className="text-2xl">Detalle de Compra</CardTitle>
                                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900">
                                    <Text className="text-green-800 dark:text-green-100 font-semibold">Completada</Text>
                                </Badge>
                            </View>
                            <CardDescription>
                                {new Date(details.fecha_registro).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })} • {new Date(details.hora_registro).toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {/* Información del Usuario */}
                            <View className="mb-6">
                                <Text className="text-xs uppercase text-muted-foreground font-semibold mb-2 tracking-wider">
                                    Cliente
                                </Text>
                                <Text className="text-lg font-medium text-foreground">
                                    {details.nombre_usuario}
                                </Text>
                            </View>

                            <Separator className="my-4" />

                            {/* Información del Producto */}
                            <View className="mb-6">
                                <Text className="text-xs uppercase text-muted-foreground font-semibold mb-3 tracking-wider">
                                    Producto Adquirido
                                </Text>
                                <Text className="text-xl font-bold text-foreground mb-2">
                                    {details.nombre_producto}
                                </Text>
                                <Text className="text-sm text-muted-foreground leading-5" numberOfLines={7}>
                                    {details.productos.descripcion}
                                </Text>
                            </View>

                            <Separator className="my-4" />

                            {/* Desglose de Precios */}
                            <View className="mb-4">
                                <Text className="text-xs uppercase text-muted-foreground font-semibold mb-3 tracking-wider">
                                    Desglose de Pago
                                </Text>

                                <View className="space-y-3">
                                    {/* Precio Original */}
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-sm text-muted-foreground">Precio original</Text>
                                        <Text className="text-base font-medium text-foreground">
                                            {details.precio}
                                        </Text>
                                    </View>

                                    {/* Descuento */}
                                    {details.descuento && (
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-sm text-muted-foreground">Descuento</Text>
                                            <View className="flex-row items-center gap-2">
                                                <Badge variant="destructive" className="bg-orange-100 dark:bg-orange-900">
                                                    <Text className="text-orange-800 dark:text-orange-100 font-semibold">
                                                        {details.descuento}
                                                    </Text>
                                                </Badge>
                                                {/* <Text className="text-base font-medium text-green-600 dark:text-green-400">
                                                    {details.precio}
                                                </Text> */}
                                            </View>
                                        </View>
                                    )}

                                    {/* Impuesto */}
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-sm text-muted-foreground">Impuesto</Text>
                                        <Text className="text-base font-medium text-foreground">
                                            {details.impuesto}
                                        </Text>
                                    </View>

                                    <Separator className="my-2" />

                                    {/* Monto Pagado */}
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-sm text-muted-foreground">Subtotal</Text>
                                        <Text className="text-base font-medium text-foreground">
                                            {details.monto_pagado}
                                        </Text>
                                    </View>

                                    {/* Precio Final */}
                                    <View className="flex-row justify-between items-center bg-primary/10 dark:bg-primary/20 p-3 rounded-lg mt-2">
                                        <Text className="text-base font-bold text-foreground">Total Pagado</Text>
                                        <Text className="text-2xl font-bold text-primary">
                                            {details.precio_final}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </CardContent>
                    </Card>
                </View>
            ))
    }



    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="ConvertSystems" showBackButton={true}>
                <ScrollView
                    className="relative bg-background p-0 md:p-4"
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#f97316']} // Color naranja para Android
                            tintColor="#f97316" // Color naranja para iOS
                            title="Actualizando..." // Texto para iOS
                            titleColor="#64748b" // Color del texto para iOS
                        />
                    }
                >
                    {renderContent()}
                </ScrollView>
            </AppLayout>
        </>
    );
}

