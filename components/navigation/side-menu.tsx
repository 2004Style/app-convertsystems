import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
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
    Gift,
    UserPlus,
    LogIn
} from 'lucide-react-native';
import * as React from 'react';
import { Modal, Pressable, View, ScrollView, Animated, Dimensions, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        <Pressable
            onPress={onPress}
            className="w-full text-black"
            style={{ opacity: 1 }}
            // android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        >
            <View className={`flex-row items-center py-4 px-4 ${variant === 'destructive' ? '' : ''}`}>
                <Icon
                    as={icon}
                    className={`w-6 h-6 mr-4 ${variant === 'destructive' ? 'text-red-500' : 'text-black'}`}
                />
                <Text
                    className={`flex-1 text-black font-medium ${variant === 'destructive' ? 'text-red-500' : 'text-black'}`}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>
        </Pressable>
    );
}

export function SideMenu({ visible, onClose }: SideMenuProps) {
    const { session, logout } = useAuth();
    const insets = useSafeAreaInsets();
    const slideAnim = React.useRef(new Animated.Value(-300)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    const menuWidth = Math.min(screenWidth * 0.85, 320); // Máximo 85% del ancho o 320px

    // Debug info
    // React.useEffect(() => {
    //     console.log('SideMenu Debug:', {
    //         visible,
    //         screenWidth,
    //         screenHeight,
    //         menuWidth,
    //         insets,
    //         statusBarHeight: StatusBar.currentHeight,
    //         platform: Platform.OS
    //     });
    // }, [visible]);

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -menuWidth,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible, slideAnim, opacityAnim, menuWidth]);

    const navigateAndClose = (route: string) => {
        onClose();
        setTimeout(() => {
            router.push(route as any);
        }, 100);
    };

    const handleLogout = () => {
        logout();
        onClose();
        setTimeout(() => {
            router.push('/auth/login');
        }, 100);
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent={false}
        >
            <View style={{ flex: 1 }}>
                {/* Overlay animado */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        opacity: opacityAnim
                    }}
                >
                    <Pressable
                        style={{ flex: 1 }}
                        onPress={onClose}
                    />
                </Animated.View>

                {/* Menú deslizable */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: menuWidth,
                        transform: [{ translateX: slideAnim }],
                        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : insets.top,
                        elevation: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 2, height: 0 },
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                        backgroundColor: 'white',
                    }}
                    className="bg-background"
                >
                    {/* Header del menú */}
                    <View className="flex-row items-center justify-between p-4 bg-primary border-b border-border">
                        <Text className="text-xl font-bold text-primary-foreground">
                            ConvertSystems
                        </Text>
                        <Pressable
                            onPress={onClose}
                            className="p-2 rounded-full"
                            android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
                        >
                            <Icon as={X} className="size-6 text-primary-foreground" />
                        </Pressable>
                    </View>

                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 40,
                            flexGrow: 1
                        }}
                        bounces={true}
                    >
                        {/* Información del usuario si está logueado */}
                        {session?.user && (
                            <View className="p-4 border-b border-border">
                                <Text className="text-lg font-semibold text-foreground">
                                    {session.user.nombre} {session.user.apellidos}
                                </Text>
                                <Text className="text-sm text-muted-foreground">
                                    {session.user.correo}
                                </Text>
                            </View>
                        )}

                        {/* Sección Principal */}
                        <View className="mt-4">
                            <Text className="text-xs font-bold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                                Principal
                            </Text>

                            <MenuItem
                                icon={Home}
                                title="Inicio"
                                onPress={() => navigateAndClose('/')}
                            />

                            {session?.user && (
                                <MenuItem
                                    icon={User}
                                    title="Mi Perfil"
                                    onPress={() => navigateAndClose('/profile')}
                                />
                            )}
                        </View>

                        <Separator className="my-4 mx-4" />

                        {/* Sección Productos */}
                        <View>
                            <Text className="text-xs font-bold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                                Productos
                            </Text>

                            <MenuItem
                                icon={Flame}
                                title="Ofertas Especiales"
                                onPress={() => navigateAndClose('/shop/ofertas')}
                            />

                            <MenuItem
                                icon={CreditCard}
                                title="Productos Premium"
                                onPress={() => navigateAndClose('/shop/pagos')}
                            />

                            <MenuItem
                                icon={Gift}
                                title="Productos Gratuitos"
                                onPress={() => navigateAndClose('/shop/gratis')}
                            />
                        </View>

                        {session?.user && (
                            <>
                                <Separator className="my-4 mx-4" />

                                {/* Sección Compras */}
                                <View>
                                    <Text className="text-xs font-bold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                                        Compras
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
                                </View>

                                <Separator className="my-4 mx-4" />

                                {/* Sección Configuración */}
                                <View>
                                    <Text className="text-xs font-bold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                                        Configuración
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
                                </View>
                            </>
                        )}

                        <Separator className="my-6 mx-4" />

                        {/* Sección de Autenticación */}
                        <View className="px-2">
                            {session?.user ? (
                                <MenuItem
                                    icon={LogOut}
                                    title="Cerrar Sesión"
                                    onPress={handleLogout}
                                    variant="destructive"
                                />
                            ) : (
                                <>
                                    <MenuItem
                                        icon={LogIn}
                                        title="Iniciar Sesión"
                                        onPress={() => navigateAndClose('/auth/login')}
                                    />
                                    <MenuItem
                                        icon={UserPlus}
                                        title="Registrarse"
                                        onPress={() => navigateAndClose('/auth/register')}
                                    />
                                </>
                            )}
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
}
