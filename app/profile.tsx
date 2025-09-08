import { AppLayout } from '@/components/navigation/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function ProfileScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="Mi Perfil">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="flex-row items-center">
                                <Icon as={User} className="size-5 mr-2" />
                                <Text>Información Personal</Text>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="gap-4">
                            <View className="flex-row items-center">
                                <Icon as={User} className="size-4 mr-3 text-muted-foreground" />
                                <Text>Juan Pérez González</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Icon as={Mail} className="size-4 mr-3 text-muted-foreground" />
                                <Text>juan.perez@example.com</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Icon as={Phone} className="size-4 mr-3 text-muted-foreground" />
                                <Text>+1 234 567 890</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Icon as={MapPin} className="size-4 mr-3 text-muted-foreground" />
                                <Text>Ciudad de México, México</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Icon as={Calendar} className="size-4 mr-3 text-muted-foreground" />
                                <Text>Miembro desde: Enero 2024</Text>
                            </View>
                        </CardContent>
                    </Card>

                    <View className="gap-3">
                        <Button className="w-full">
                            <Text>Editar Perfil</Text>
                        </Button>

                        <Button variant="outline" className="w-full">
                            <Text>Cambiar Contraseña</Text>
                        </Button>
                    </View>
                </ScrollView>
            </AppLayout>
        </>
    );
}
