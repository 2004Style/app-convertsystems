import { AppLayout } from '@/components/navigation/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { Heart, Star, Package, Calendar } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

interface FavoriteItemProps {
    title: string;
    description: string;
    price: string;
    dateAdded: string;
    rating: number;
}

function FavoriteItem({ title, description, price, dateAdded, rating }: FavoriteItemProps) {
    return (
        <Card className="mb-3">
            <CardContent className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-semibold flex-1 mr-2">{title}</Text>
                    <Button size="sm" variant="ghost" className="p-1">
                        <Icon as={Heart} className="size-4 text-red-500" />
                    </Button>
                </View>

                <Text className="text-sm text-muted-foreground mb-3">
                    {description}
                </Text>

                <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-bold text-lg">{price}</Text>
                    <View className="flex-row items-center">
                        <Icon as={Star} className="size-4 text-yellow-500 mr-1" />
                        <Text className="text-sm">{rating}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Icon as={Calendar} className="size-4 mr-1 text-muted-foreground" />
                        <Text className="text-xs text-muted-foreground">
                            Agregado: {dateAdded}
                        </Text>
                    </View>

                    <Button size="sm">
                        <Text className="text-xs">Comprar</Text>
                    </Button>
                </View>
            </CardContent>
        </Card>
    );
}

export default function FavoritesScreen() {
    const favorites = [
        {
            title: 'Plan Premium Anual',
            description: 'Acceso completo a todas las herramientas y funciones premium por un año completo.',
            price: '$299.99',
            dateAdded: '15 Ago 2024',
            rating: 4.8,
        },
        {
            title: 'Consultoría Personalizada',
            description: 'Sesión de consultoría uno a uno con nuestros expertos para optimizar tu negocio.',
            price: '$149.99',
            dateAdded: '10 Ago 2024',
            rating: 4.9,
        },
        {
            title: 'Pack de Herramientas Avanzadas',
            description: 'Conjunto completo de herramientas para análisis y automatización empresarial.',
            price: '$79.99',
            dateAdded: '5 Ago 2024',
            rating: 4.6,
        },
        {
            title: 'Curso de Marketing Digital',
            description: 'Aprende las mejores estrategias de marketing digital con casos reales y prácticos.',
            price: '$199.99',
            dateAdded: '1 Ago 2024',
            rating: 4.7,
        },
    ];

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="Favoritos">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Icon as={Heart} className="size-5 mr-2 text-red-500" />
                                    <Text>Mis Favoritos</Text>
                                </View>
                                <View className="bg-red-100 rounded-full px-3 py-1">
                                    <Text className="text-red-600 text-sm font-semibold">
                                        {favorites.length}
                                    </Text>
                                </View>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Text className="text-sm text-muted-foreground">
                                Aquí encontrarás todos los productos y servicios que has marcado como favoritos.
                            </Text>
                        </CardContent>
                    </Card>

                    <View className="mb-4">
                        {favorites.map((favorite, index) => (
                            <FavoriteItem
                                key={index}
                                title={favorite.title}
                                description={favorite.description}
                                price={favorite.price}
                                dateAdded={favorite.dateAdded}
                                rating={favorite.rating}
                            />
                        ))}
                    </View>

                    {favorites.length === 0 && (
                        <Card>
                            <CardContent className="p-8 items-center">
                                <Icon as={Heart} className="size-12 text-muted-foreground mb-4" />
                                <Text className="text-center text-muted-foreground mb-4">
                                    Aún no tienes productos favoritos
                                </Text>
                                <Button>
                                    <Icon as={Package} className="size-4 mr-2" />
                                    <Text>Explorar Productos</Text>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    <View className="gap-3 mt-4">
                        <Button variant="outline" className="w-full">
                            <Text>Limpiar Favoritos</Text>
                        </Button>

                        <Button className="w-full">
                            <Icon as={Package} className="size-4 mr-2" />
                            <Text>Ver Todos los Productos</Text>
                        </Button>
                    </View>
                </ScrollView>
            </AppLayout>
        </>
    );
}
