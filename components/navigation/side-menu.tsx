import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import {
    Home,
    User,
    Settings,
    Heart,
    ShoppingBag,
    Bell,
    LogOut,
    X,
    Flame,
    CreditCard,
    Gift
} from 'lucide-react-native';
import * as React from 'react';
import { Modal, Pressable, View, ScrollView } from 'react-native';

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

interface MenuItemProps {
    icon: any;
    title: string;
    onPress: () => void;
    variant?: 'default' | 'destructive';
}

function MenuItem({ icon, title, onPress, variant = 'default' }: MenuItemProps) {
    return (
        <Button
            variant="ghost"
            className={`w-full justify-start py-3 px-4 ${variant === 'destructive' ? 'text-red-500' : ''}`}
            onPress={onPress}
        >
            <View className="flex-row items-center flex-1 min-w-0">
                <Icon
                    as={icon}
                    className={`w-5 h-5 mr-3 flex-shrink-0 ${variant === 'destructive' ? 'text-red-500' : ''}`}
                />
                <Text
                    className={`flex-1 text-base leading-3 ${variant === 'destructive' ? 'text-red-500' : ''}`}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>
        </Button>
    );
}

export function SideMenu({ visible, onClose }: SideMenuProps) {
    const navigateAndClose = (route: string) => {
        onClose();
        router.push(route as any);
    };

    const handleLogout = () => {
        onClose();
        // TODO: Implementar lógica de logout
        router.push('/sign-in-form');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 flex-row">
                {/* Overlay */}
                <Pressable
                    className="flex-1 bg-black/50"
                    onPress={onClose}
                />

                {/* Menú */}
                <View className="w-72 min-w-[280px] max-w-[90%] bg-background h-full shadow-lg">
                    {/* Header del menú */}
                    <View className="flex-row items-center justify-between p-4 bg-primary">
                        <Text className="text-lg font-bold text-primary-foreground">
                            ConvertSystems
                        </Text>
                        <Button
                            size="icon"
                            variant="ghost"
                            onPress={onClose}
                            className="text-primary-foreground"
                        >
                            <Icon as={X} className="size-5 text-primary-foreground" />
                        </Button>
                    </View>

                    <ScrollView className="flex-1 px-1 py-2" showsVerticalScrollIndicator={false}>
                        {/* Sección Principal */}
                        <Text className="text-sm font-semibold text-muted-foreground px-4 pt-3 pb-1">
                            PRINCIPAL
                        </Text>

                        <MenuItem
                            icon={Home}
                            title="Inicio"
                            onPress={() => navigateAndClose('/')}
                        />

                        <MenuItem
                            icon={User}
                            title="Mi Perfil"
                            onPress={() => navigateAndClose('/profile')}
                        />

                        <Separator className="my-2" />

                        {/* Sección Productos */}
                        <Text className="text-sm font-semibold text-muted-foreground px-4 pt-3 pb-1">
                            PRODUCTOS
                        </Text>

                        <MenuItem
                            icon={Flame}
                            title="Ofertas Especiales"
                            onPress={() => navigateAndClose('/ofertas')}
                        />

                        <MenuItem
                            icon={CreditCard}
                            title="Productos Premium"
                            onPress={() => navigateAndClose('/pago')}
                        />

                        <MenuItem
                            icon={Gift}
                            title="Productos Gratuitos"
                            onPress={() => navigateAndClose('/gratis')}
                        />

                        <Separator className="my-2" />

                        {/* Sección Compras */}
                        <Text className="text-sm font-semibold text-muted-foreground px-4 pt-3 pb-1">
                            COMPRAS
                        </Text>

                        <MenuItem
                            icon={ShoppingBag}
                            title="Mis Compras"
                            onPress={() => navigateAndClose('/purchases')}
                        />

                        <MenuItem
                            icon={Heart}
                            title="Favoritos"
                            onPress={() => navigateAndClose('/favorites')}
                        />

                        <Separator className="my-2" />

                        {/* Sección Configuración */}
                        <Text className="text-sm font-semibold text-muted-foreground px-4 pt-3 pb-1">
                            CONFIGURACIÓN
                        </Text>

                        <MenuItem
                            icon={Bell}
                            title="Notificaciones"
                            onPress={() => navigateAndClose('/notifications')}
                        />

                        <MenuItem
                            icon={Settings}
                            title="Configuración"
                            onPress={() => navigateAndClose('/settings')}
                        />

                        <Separator className="my-4" />

                        {/* Logout */}
                        {/* <MenuItem
                            icon={LogOut}
                            title="Cerrar Sesión"
                            onPress={handleLogout}
                            variant="destructive"
                        /> */}
                        <MenuItem
                            icon={LogOut}
                            title="Log In"
                            onPress={() => navigateAndClose('/sign-in-form')}
                            variant="default"
                        />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
