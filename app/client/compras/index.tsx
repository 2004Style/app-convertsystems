import { AppLayout } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/contexts/AuthContext";
import { useCosultaApi } from "@/hooks/datosApi.hook";
import { TiendaHistorialUserCompradosB_Client } from "@/routes/user.routes";
import { router, Stack } from "expo-router";
import { Eye, ShoppingBag, Package, HardDrive } from "lucide-react-native";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View, Image } from "react-native";

interface CardProductosCompradosProps {
    idVenta?: number;
    idDroducto: number;
    nombre: string;
    version: string;
    size: string;
}

export default function HistorialComprasPage() {
    const { get, sessionStatus } = useCosultaApi();

    const [productos, setProductos] = useState<CardProductosCompradosProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConsulta = async () => {
        const { alert, data } = await get(`${TiendaHistorialUserCompradosB_Client}`, { "Content-Type": "application/json", });
        setLoading(false);
        setRefreshing(false);
        console.log(data);
        if (alert === "success") {
            if(!data.records) {
                setProductos([]);
                return;
            }
            setProductos(data.records);
            return
        }
        setError("Error al obtener los productos " + error);

    };

    const onRefresh = async () => {
        setRefreshing(true);
        setError(null);
        await fetchConsulta();
    };

    useEffect(() => {
        if (sessionStatus !== "authenticated") return;
        fetchConsulta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionStatus]);

    const renderContent = () => {
        if (loading) return <Text className="text-center text-muted-foreground">Cargando...</Text>;
        return (
            <View className="flex-1 flex-col gap-6">
                {/* Header */}
                <View className="items-center">
                    <Text className="text-3xl font-bold text-foreground">Historial de Compras</Text>
                    <Text className="text-sm text-muted-foreground mt-1">
                        {productos.length} {productos.length === 1 ? 'producto adquirido' : 'productos adquiridos'}
                    </Text>
                </View>

                {productos.length === 0 ? (
                    <Card className="p-8 items-center">
                        <Icon as={Package} size={48} className="text-muted-foreground mb-4" />
                        <Text className="text-center text-lg font-semibold text-foreground mb-2">
                            No hay compras aún
                        </Text>
                        <Text className="text-center text-sm text-muted-foreground">
                            Cuando realices tu primera compra, aparecerá aquí
                        </Text>
                    </Card>
                ) : (
                    productos.map((producto, index) => (
                        <Card key={producto.idVenta} className="overflow-hidden shadow-md">
                            <CardHeader >
                                <View className="flex-row items-start gap-3">
                                    {/* Imagen del producto con bordes redondeados */}
                                    <View className="bg-primary/10 dark:bg-primary/20 rounded-xl p-3 items-center justify-center">
                                        <Icon as={Package} size={32} className="text-primary" />
                                    </View>

                                    {/* Información principal */}
                                    <View className="flex-1">
                                        <View className="flex-row items-center justify-between">
                                            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900">
                                                <Text className="text-blue-800 dark:text-blue-100 font-semibold text-xs">
                                                    Compra #{index + 1}
                                                </Text>
                                            </Badge>
                                        </View>
                                        <CardTitle className="text-xl">{producto.nombre}</CardTitle>
                                    </View>
                                </View>
                            </CardHeader>

                            <CardContent >
                                {/* Detalles del producto */}
                                <View className="bg-muted/30 dark:bg-muted/50 rounded-lg flex-row justify-between">
                                    <View className="flex-row items-center gap-2">
                                        <Icon as={Package} size={14} className="text-muted-foreground" />
                                        <Text className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                            Versión
                                        </Text>
                                        <Text className="text-sm font-medium text-foreground ">
                                            {producto.version}
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center gap-2">
                                        <Icon as={HardDrive} size={14} className="text-muted-foreground" />
                                        <Text className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                                            Tamaño
                                        </Text>
                                        <Badge variant="outline" className="self-start">
                                            <Text className="font-semibold">{producto.size}</Text>
                                        </Badge>
                                    </View>
                                </View>

                                <Separator className="my-2" />

                                {/* Botones de acción */}
                                <View className="flex-row gap-2">
                                    <Button
                                        className="flex-1"
                                        variant="default"
                                        onPress={() => { router.push(`/client/compras/${producto.idVenta}`); }}
                                    >
                                        <Icon as={Eye} size={16} className="text-primary-foreground" />
                                        <Text className="text-primary-foreground font-semibold">Ver Compra</Text>
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                        onPress={() => { router.push(`/producto/${producto.idDroducto}`); }}
                                    >
                                        <Icon as={Package} size={16} className="text-foreground" />
                                        <Text className="text-foreground font-semibold">Ver Producto</Text>
                                    </Button>
                                </View>
                            </CardContent>
                        </Card>
                    ))
                )}
            </View>
        )
    }


    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="ConvertSystems" showBackButton={true}>
                <ScrollView
                    contentContainerStyle={{ padding: 16 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#f97316']} // Color naranja para Android
                            tintColor="#f97316" // Color naranja para iOS
                            title="Actualizando..." // Texto para iOS
                            titleColor="#64748b" // Color del texto para iOS
                        />
                    }>
                    {renderContent()}
                </ScrollView>
            </AppLayout>
        </>
    );
}