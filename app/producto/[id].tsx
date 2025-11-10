import { useState, useEffect, useCallback } from "react";
import { ProductoConRequisitosArray } from "@/interfaces/interfaces";
import { TiendaB_Client } from "@/routes/user.routes";
import { BtnLike } from "@/components/botones/Like";
import { BtnDescargar } from "@/components/botones/Descargar";
import { formatearFechaParaString } from "@/utils/formatearFecha";
import { preciocondescuento } from "@/utils/preciocondescuento";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, Tag, Info, CheckCircle2, Star } from "lucide-react-native";
import { bg_planesGradient } from "@/utils/bg.clases.planes";
import { useCosultaApi } from "@/hooks/datosApi.hook";
import { TipodeCompra } from "@/utils/url-compras";
import { Payment } from "@/components/payments/payments-methods";
import { Text } from "@/components/ui/text";
import { View, Image, ScrollView, RefreshControl, Alert, Platform, ImageBackground } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { AppLayout } from "@/components/navigation";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { ReseniasB_Client } from "@/routes/user.routes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CrearResenia from "@/components/crear-resenia";
const cardBackground = require("@/assets/images/icon.png");

export default function ProductoDetails() {
    const { session } = useAuth();
    const { id } = useLocalSearchParams();
    const { get, sessionStatus, delete: deleteRequest } = useCosultaApi();
    const [producto, setProducto] = useState<ProductoConRequisitosArray | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [descuentoAplicado, setDescuentoAplicado] = useState<number>(0);
    const [refreshing, setRefreshing] = useState(false);

    const fetchConsulta = useCallback(async () => {
        const { alert, data } = await get(`${TiendaB_Client}/${id}`);
        setRefreshing(false);
        if (alert === "success") {
            const requisitos = JSON.parse(data.requisitos_tecnicos);
            const descuento = Number(data.productos_ofertas?.[0]?.ofertas?.descuento ?? 0);
            const precioDescuento = preciocondescuento(Number(data.precio), descuento);
            setProducto({
                ...data,
                requisitos_tecnicos: requisitos,
            });
            setDescuentoAplicado(precioDescuento);
            setLoading(false);
            return;
        }
        setError("Error al obtener el producto");
        setLoading(false);
    }, [id, get]);

    const handleReseniaCreada = useCallback(() => {
        // Refrescar las reseñas después de crear una nueva
        setTimeout(() => {
            fetchConsulta();
        }, 300);
    }, [fetchConsulta]);

    const handleEliminar = async (reseniaId: string) => {
        // En web usar window.confirm, en mobile usar Alert.alert con botones
        if (Platform.OS === 'web') {
            const confirmed = typeof window !== 'undefined' ? window.confirm('¿Estás seguro que deseas eliminar tu reseña?') : false;
            if (!confirmed) return;
            const { alert, data } = await deleteRequest(`${ReseniasB_Client}/${reseniaId}`);
            if (alert === 'error') {
                if (typeof window !== 'undefined') window.alert(data?.message || 'Error al eliminar la reseña');
                return;
            }
            await fetchConsulta();
        }

        // Mobile / native
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro que deseas eliminar tu reseña?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        const { alert, data } = await deleteRequest(`${ReseniasB_Client}/${reseniaId}`);
                        if (alert === 'error') {
                            Alert.alert(data?.message || 'Error al eliminar la reseña');
                            return;
                        }

                        await fetchConsulta();

                    },
                },
            ],
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setError(null);
        await fetchConsulta();
    };

    useEffect(() => {
        if (sessionStatus !== "authenticated") return;
        fetchConsulta();
    }, [id, sessionStatus, fetchConsulta]);

    if (loading) return <Text>Cargando</Text>;
    if (error) return <Text className="text-red-500">{error}</Text>;

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            {producto && (
                <AppLayout title="ConvertSystems" showBackButton={true}>
                    <ScrollView
                        className="relative bg-background p-0 md:p-4"
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        scrollsToTop={false}
                        keyboardShouldPersistTaps="handled"
                        scrollEventThrottle={16}
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
                        <View className="w-full flex flex-col gap-4 p-4">
                            <Card className="flex flex-col md:flex-row gap-4 p-4 items-start">
                                {/* Product Image */}
                                <View className="relative overflow-hidden items-center justify-center w-full md:w-1/3">
                                    <ImageBackground
                                        source={cardBackground}
                                        className="w-full rounded-lg object-cover aspect-square"
                                        imageStyle={{
                                            flex: 1,
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: 8,
                                            resizeMode: 'cover', // centrar y ajustar la imagen dentro del contenedor
                                        }}
                                    />
                                    <View className="absolute bottom-2 right-2 md:bottom-4 md:right-4">
                                        <BtnLike id={producto.id} like={producto.like} likesCount={producto.likeCount} />
                                    </View>
                                    {producto.plan &&
                                        <Badge
                                            className={`absolute top-4 right-4 md:top-6 md:right-6`}
                                            style={{ backgroundColor: bg_planesGradient(producto.plan.nombre).Color1 }}
                                        >
                                            <Text style={{ color: bg_planesGradient(producto.plan.nombre).foreground }}>
                                                {producto.plan.nombre}
                                            </Text>
                                        </Badge>
                                    }
                                </View>

                                {/* Product Info */}
                                <View className="flex-1 space-y-6 w-full md:w-2/3">
                                    <View className="relative">
                                        <Text className="text-3xl font-bold">{producto.nombre}</Text>
                                        <View className="flex-row items-center gap-2 mb-4">
                                            <Badge variant="outline" className="bg-orange-300/10 text-orange-300">{producto.categorias.nombre}</Badge>
                                            {producto.plan &&
                                                <Badge variant="outline" style={{ backgroundColor: bg_planesGradient(producto.plan.nombre).Color1 }} >
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
                                            <Payment id={producto.id} precio={descuentoAplicado > 0 ? String(descuentoAplicado) : String(producto.precio)} comprar={TipodeCompra.producto} />
                                        }
                                    </View>

                                    <View className="flex flex-col md:flex-row gap-4 text-sm">
                                        <View className="flex-row items-center gap-2 text-muted-foreground">
                                            <Icon as={Calendar} className="h-4 w-4" />
                                            <Text>Released: {formatearFechaParaString(producto.fecha_registro)}</Text>
                                        </View>
                                        <View className="flex-row items-center gap-2 text-muted-foreground">
                                            <Icon as={Tag} className="h-4 w-4" />
                                            <Text>Category: {producto.categorias.nombre}</Text>
                                        </View>
                                    </View>

                                    <View className="space-y-4 relative flex flex-col">
                                        <Text className="text-lg font-semibold">Description</Text>
                                        <Text className="flex text-wrap text-muted-foreground">{producto.descripcion}</Text>
                                    </View>
                                </View>
                            </Card>

                            {/* Requirements */}
                            <Card className="p-6">
                                <View className="flex-row flex-nowrap text-nowrap text-xl font-semibold items-center gap-2">
                                    <Icon as={Info} />
                                    <Text>System Requirements</Text>
                                </View>
                                <View className="grid md:grid-cols-2 gap-3">
                                    {producto.requisitos_tecnicos.map((req, index) => (
                                        <View key={index} className="flex-row items-center gap-2 text-muted-foreground">
                                            <Icon as={CheckCircle2} className="h-4 w-4 text-blue-600" />
                                            <Text>{req}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>

                            {/* Versions */}
                            {producto.versiones.length > 0 &&
                                <Card className="p-2 md:p-6">
                                    <View className="text-xl font-semibold flex-row items-center gap-2">
                                        <Icon as={Package} />
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
                            {/* Resenias */}
                            {producto.versiones.length > 0 &&
                                <Card className="p-6">
                                    <View className="flex-row gap-2 text-xl mb-6 items-center ">
                                        <Icon as={Star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                        <Text className="font-semibold">Reseñas de Usuarios</Text>
                                    </View>

                                    {/* Formulario para crear reseña */}
                                    {session?.user?.id && (
                                        <CrearResenia
                                            id_user={session.user.id}
                                            id_product={id as string}
                                            onReseniaCreada={handleReseniaCreada}
                                        />
                                    )}
                                    {/* Lista de reseñas */}
                                    {producto.resenias.length > 0 ? (
                                        <View className="space-y-4">
                                            {producto.resenias.map((resenia) => (
                                                <Card key={resenia.id} className="p-5">
                                                    <View className="flex-row gap-4">
                                                        {/* Avatar del usuario */}
                                                        <Avatar className="h-12 w-12" alt={resenia.usuarios?.nombre || "Usuario"}>
                                                            <AvatarImage
                                                                src={resenia.usuarios?.urlPerfil || "/logo.png"}
                                                            />
                                                            <AvatarFallback>
                                                                {resenia.usuarios?.nombre?.charAt(0).toUpperCase() || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        {/* Contenido de la reseña */}
                                                        <View className="flex-1 space-y-2">
                                                            {/* Nombre y fecha */}
                                                            <View className="flex-row items-center justify-between flex-wrap gap-2">
                                                                <Text className="font-semibold text-base">
                                                                    {resenia.usuarios?.nombre || "Usuario Anónimo"}
                                                                </Text>
                                                                <View className="flex-row items-center gap-2">
                                                                    <Text className="text-xs text-muted-foreground">
                                                                        {formatearFechaParaString(resenia.fecha_registro)}
                                                                    </Text>
                                                                    {session?.user?.id === resenia.usuario_id && (
                                                                        <Button
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            onPress={() => void handleEliminar(resenia.id)}
                                                                        >
                                                                            <Text>Eliminar</Text>
                                                                        </Button>
                                                                    )}
                                                                </View>
                                                            </View>

                                                            {/* Estrellas de calificación */}
                                                            <View className="flex-row items-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Icon as={Star}
                                                                        key={star}
                                                                        className={`h-4 w-4 ${star <= resenia.calificacion
                                                                            ? "fill-amber-400 text-amber-400"
                                                                            : "text-muted-foreground"
                                                                            }`}
                                                                    />
                                                                ))}
                                                                <Text className="ml-2 text-sm text-muted-foreground">
                                                                    ({resenia.calificacion}/5)
                                                                </Text>
                                                            </View>

                                                            {/* Comentario */}
                                                            <Text className="text-sm text-muted-foreground leading-relaxed">
                                                                {resenia.comentario}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </Card>
                                            ))}
                                        </View>
                                    ) : (
                                        <View className="text-center py-8 text-muted-foreground">
                                            <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                                            <Text>No hay reseñas aún. ¡Sé el primero en dejar una!</Text>
                                        </View>
                                    )}
                                </Card>
                            }

                        </View>
                    </ScrollView>
                </AppLayout>
            )}
        </>
    );
}

