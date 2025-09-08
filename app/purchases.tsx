import { AppLayout } from '@/components/navigation/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { ShoppingBag, Package, Calendar, CreditCard } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

interface PurchaseItemProps {
    title: string;
    date: string;
    amount: string;
    status: 'completed' | 'pending' | 'cancelled';
}

function PurchaseItem({ title, date, amount, status }: PurchaseItemProps) {
    const statusColors = {
        completed: 'text-green-600',
        pending: 'text-yellow-600',
        cancelled: 'text-red-600',
    };

    const statusText = {
        completed: 'Completado',
        pending: 'Pendiente',
        cancelled: 'Cancelado',
    };

    return (
        <Card className="mb-3">
            <CardContent className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-semibold flex-1">{title}</Text>
                    <Text className="font-bold">{amount}</Text>
                </View>

                <View className="flex-row items-center mb-2">
                    <Icon as={Calendar} className="size-4 mr-2 text-muted-foreground" />
                    <Text className="text-sm text-muted-foreground">{date}</Text>
                </View>

                <Text className={`text-sm font-medium ${statusColors[status]}`}>
                    {statusText[status]}
                </Text>
            </CardContent>
        </Card>
    );
}

export default function PurchasesScreen() {
    const purchases = [
        {
            title: 'Plan Premium - Mensual',
            date: '15 de agosto, 2024',
            amount: '$29.99',
            status: 'completed' as const,
        },
        {
            title: 'Consultoría Personalizada',
            date: '10 de agosto, 2024',
            amount: '$149.99',
            status: 'completed' as const,
        },
        {
            title: 'Pack de Herramientas',
            date: '5 de agosto, 2024',
            amount: '$79.99',
            status: 'pending' as const,
        },
    ];

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="Mis Compras">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="flex-row items-center">
                                <Icon as={ShoppingBag} className="size-5 mr-2" />
                                <Text>Resumen de Compras</Text>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="gap-4">
                            <View className="flex-row justify-between">
                                <Text className="text-muted-foreground">Total gastado:</Text>
                                <Text className="font-bold">$259.97</Text>
                            </View>

                            <View className="flex-row justify-between">
                                <Text className="text-muted-foreground">Compras realizadas:</Text>
                                <Text className="font-bold">3</Text>
                            </View>
                        </CardContent>
                    </Card>

                    <View className="mb-4">
                        <Text className="text-lg font-semibold mb-3">Historial de Compras</Text>
                        {purchases.map((purchase, index) => (
                            <PurchaseItem
                                key={index}
                                title={purchase.title}
                                date={purchase.date}
                                amount={purchase.amount}
                                status={purchase.status}
                            />
                        ))}
                    </View>

                    <Button className="w-full">
                        <Icon as={Package} className="size-4 mr-2" />
                        <Text>Ver Todos los Productos</Text>
                    </Button>
                </ScrollView>
            </AppLayout>
        </>
    );
}
