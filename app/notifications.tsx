import { AppLayout } from '@/components/navigation/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { Bell, Check, Clock, AlertCircle, Info } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

interface NotificationItemProps {
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead?: boolean;
}

function NotificationItem({ title, message, time, type, isRead = false }: NotificationItemProps) {
    const typeIcons = {
        info: Info,
        success: Check,
        warning: Clock,
        error: AlertCircle,
    };

    const typeColors = {
        info: 'text-blue-500',
        success: 'text-green-500',
        warning: 'text-yellow-500',
        error: 'text-red-500',
    };

    return (
        <Card className={`mb-3 ${!isRead ? 'bg-blue-50' : ''}`}>
            <CardContent className="p-4">
                <View className="flex-row items-start">
                    <Icon
                        as={typeIcons[type]}
                        className={`w-5 h-5 mr-3 mt-1 ${typeColors[type]}`}
                    />
                    <View className="flex-1">
                        <Text className="font-semibold mb-1">{title}</Text>
                        <Text className="text-sm text-muted-foreground mb-2">
                            {message}
                        </Text>
                        <Text className="text-xs text-muted-foreground">{time}</Text>
                    </View>
                    {!isRead && (
                        <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    )}
                </View>
            </CardContent>
        </Card>
    );
}

export default function NotificationsScreen() {
    const notifications = [
        {
            title: 'Compra Exitosa',
            message: 'Tu compra del Plan Premium ha sido procesada correctamente.',
            time: 'Hace 2 horas',
            type: 'success' as const,
            isRead: false,
        },
        {
            title: 'Actualización Disponible',
            message: 'Nueva versión de la aplicación disponible con mejoras.',
            time: 'Hace 5 horas',
            type: 'info' as const,
            isRead: false,
        },
        {
            title: 'Pago Pendiente',
            message: 'Tu suscripción mensual vence en 3 días.',
            time: 'Hace 1 día',
            type: 'warning' as const,
            isRead: true,
        },
        {
            title: 'Intento de Acceso',
            message: 'Se detectó un intento de acceso desde un dispositivo no reconocido.',
            time: 'Hace 2 días',
            type: 'error' as const,
            isRead: true,
        },
        {
            title: 'Bienvenido',
            message: 'Gracias por unirte a ConvertSystems. Explora todas las funciones.',
            time: 'Hace 1 semana',
            type: 'info' as const,
            isRead: true,
        },
    ];

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="Notificaciones">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Icon as={Bell} className="size-5 mr-2" />
                                    <Text>Notificaciones</Text>
                                </View>
                                {unreadCount > 0 && (
                                    <View className="bg-blue-500 rounded-full px-2 py-1 min-w-[24px] items-center">
                                        <Text className="text-white text-xs font-bold">
                                            {unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    {unreadCount > 0 && (
                        <View className="mb-4">
                            <Button variant="outline" className="w-full">
                                <Text>Marcar Todas como Leídas</Text>
                            </Button>
                        </View>
                    )}

                    <View className="mb-4">
                        {notifications.map((notification, index) => (
                            <NotificationItem
                                key={index}
                                title={notification.title}
                                message={notification.message}
                                time={notification.time}
                                type={notification.type}
                                isRead={notification.isRead}
                            />
                        ))}
                    </View>

                    {notifications.length === 0 && (
                        <Card>
                            <CardContent className="p-8 items-center">
                                <Icon as={Bell} className="size-12 text-muted-foreground mb-4" />
                                <Text className="text-center text-muted-foreground">
                                    No tienes notificaciones en este momento
                                </Text>
                            </CardContent>
                        </Card>
                    )}
                </ScrollView>
            </AppLayout>
        </>
    );
}
