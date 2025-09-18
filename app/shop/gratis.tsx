import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { Productos } from '@/interfaces/interfaces';
import { Stack } from 'expo-router';
import { formatearFechaParaString } from '@/utils/formatearFecha';
import { Clock, Database, GitBranch } from 'lucide-react-native';
import { useCosultaApi } from '@/hooks/datosApi.hook';
import { TiendaB_Public } from '@/routes/public.routes';
import { CardTienda } from '@/components/shop/card-store';
import { AppLayout } from '@/components/navigation';

export default function GratisScreen() {
    const { get } = useCosultaApi()
    const [productos, setProductos] = useState<Productos[]>([]);

    useEffect(() => {
        const fetchProductos = async () => {
            const { alert, data } = await get(`${TiendaB_Public}/gratis`);
            console.log("alerta: ", alert)
            if (alert === 'error') {
                Alert.alert('Error', data?.message || 'Error al cargar los productos');
                return;
            }
            setProductos(data.records || []);
        };

        fetchProductos();
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="ConvertSystems">
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 8 }}>
                    <View
                        className="flex flex-row flex-wrap p-2 gap-2 justify-center"
                    >
                        {productos.length > 0 ? (
                            productos.map((producto) => (
                                <CardTienda
                                    key={producto.id}
                                    card={{
                                        fecha_registro: producto.fecha_registro,
                                        plan: producto.plan ? producto.plan.nombre : null,
                                        id: producto.id,
                                        nombre: producto.nombre,
                                        categoria: producto.categorias.nombre,
                                        descipcion: producto.descripcion,
                                        version: [
                                            {
                                                icon: GitBranch,
                                                valor: producto.versiones?.[0].numero_version
                                            },
                                            {
                                                icon: Database,
                                                valor: producto.versiones?.[0].size || ""
                                            },
                                            {
                                                icon: Clock,
                                                valor: formatearFechaParaString(producto.versiones?.[0].fecha_lanzamiento)
                                            },
                                        ]
                                    }}
                                />
                            ))
                        ) : (
                            <View className="flex-1 justify-center items-center py-20">

                                <Text className="text-gray-400 text-sm text-center mb-4">
                                    Error al obtener datos
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </AppLayout>
        </>

    );
}
