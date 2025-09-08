import { AppLayout } from '@/components/navigation/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { Settings, Bell, Eye, Shield, Smartphone, Globe } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, View, Switch } from 'react-native';

interface SettingItemProps {
    icon: any;
    title: string;
    description?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
}

function SettingItem({ icon, title, description, onPress, rightElement }: SettingItemProps) {
    return (
        <Button
            variant="ghost"
            className="w-full justify-start py-4 px-4 h-auto"
            onPress={onPress}
        >
            <View className="flex-row items-center flex-1 min-w-0">
                <Icon
                    as={icon}
                    className="w-5 h-5 mr-3 flex-shrink-0 text-muted-foreground"
                />
                <View className="flex-1 min-w-0">
                    <Text className="font-medium">{title}</Text>
                    {description && (
                        <Text className="text-sm text-muted-foreground mt-1">{description}</Text>
                    )}
                </View>
                {rightElement && (
                    <View className="ml-3">
                        {rightElement}
                    </View>
                )}
            </View>
        </Button>
    );
}

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [biometricEnabled, setBiometricEnabled] = React.useState(false);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="Configuración">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Card className="mb-4">
                        <CardHeader>
                            <CardTitle className="flex-row items-center">
                                <Icon as={Settings} className="size-5 mr-2" />
                                <Text>Configuración General</Text>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <SettingItem
                                icon={Bell}
                                title="Notificaciones"
                                description="Gestionar notificaciones push y por email"
                                rightElement={
                                    <Switch
                                        value={notificationsEnabled}
                                        onValueChange={setNotificationsEnabled}
                                    />
                                }
                            />

                            <Separator />

                            <SettingItem
                                icon={Eye}
                                title="Privacidad"
                                description="Configurar opciones de privacidad"
                                onPress={() => { }}
                            />

                            <Separator />

                            <SettingItem
                                icon={Shield}
                                title="Seguridad"
                                description="Autenticación biométrica y contraseñas"
                                rightElement={
                                    <Switch
                                        value={biometricEnabled}
                                        onValueChange={setBiometricEnabled}
                                    />
                                }
                            />

                            <Separator />

                            <SettingItem
                                icon={Smartphone}
                                title="Preferencias de App"
                                description="Personalizar la experiencia de usuario"
                                onPress={() => { }}
                            />

                            <Separator />

                            <SettingItem
                                icon={Globe}
                                title="Idioma y Región"
                                description="Español (México)"
                                onPress={() => { }}
                            />
                        </CardContent>
                    </Card>

                    <View className="gap-3 mt-4">
                        <Button variant="outline" className="w-full">
                            <Text>Exportar Datos</Text>
                        </Button>

                        <Button variant="outline" className="w-full">
                            <Text>Contactar Soporte</Text>
                        </Button>

                        <Button variant="outline" className="w-full">
                            <Text>Términos y Condiciones</Text>
                        </Button>
                    </View>
                </ScrollView>
            </AppLayout>
        </>
    );
}
