import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import {
    Home,
    ShoppingBag,
    LogOut,
    X,
    Flame,
    CreditCard,
    Gift,
    UserPlus,
    LogIn
} from 'lucide-react-native';
import { useEffect, useRef } from 'react';
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
            className="w-full"
            style={{ opacity: 1 }}
        >
            <View className={`flex-row items-center py-4 px-4 ${variant === 'destructive' ? '' : ''}`}>
                <Icon
                    as={icon}
                    className={`w-6 h-6 mr-4 ${variant === 'destructive' ? 'text-red-500' : 'text-foreground'}`}
                />
                <Text
                    className={`flex-1 font-medium ${variant === 'destructive' ? 'text-red-500' : 'text-foreground'}`}
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
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    const menuWidth = Math.min(screenWidth * 0.85, 320); // Máximo 85% del ancho o 320px

    useEffect(() => {
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
                    }}
                    className="bg-sky-400 dark:bg-sky-900"
                >
                    {/* Header del menú */}
                    <View className="absolute w-full flex-row items-center justify-between bg-sky-500 dark:bg-sky-950">
                        <Text className="text-xl px-4 py-2 font-bold text-foreground">
                            ConvertSystems
                        </Text>
                        <Pressable
                            onPress={onClose}
                            className="p-2 rounded-full"
                            android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
                        >
                            <Icon as={X} className="size-6 text-foreground" />
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
                            <>
                                <View className="px-4">
                                    <Text className="text-lg font-semibold text-foreground">
                                        {session.user.nombre} {session.user.apellidos}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">
                                        {session.user.correo}
                                    </Text>
                                </View>
                                <Separator className="my-4 mx-4" />
                            </>
                        )}

                        {/* Sección Principal */}
                        <View>
                            <Text className="text-xs font-bold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                                Principal
                            </Text>

                            <MenuItem
                                icon={Home}
                                title="Inicio"
                                onPress={() => navigateAndClose('/')}
                            />

                            {/* {session?.user && (
                                <MenuItem
                                    icon={User}
                                    title="Mi Perfil"
                                    onPress={() => navigateAndClose('/profile')}
                                />
                            )} */}
                        </View>

                        <Separator className="my-4 mx-4" />

                        {/* Sección Productos */}
                        <View>
                            <Text className="text-xs font-bold text-muted-foreground px-4 mb-2 uppercase tracking-wider">
                                tienda
                            </Text>

                            <MenuItem
                                icon={CreditCard}
                                title="Pagos"
                                onPress={() => navigateAndClose('/shop/pagos')}
                            />

                            <MenuItem
                                icon={Flame}
                                title="Ofertas"
                                onPress={() => navigateAndClose('/shop/ofertas')}
                            />

                            <MenuItem
                                icon={Gift}
                                title="Gratis"
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
                                        onPress={() => navigateAndClose('/client/compras')}
                                    />
                                </View>

                            </>
                        )}

                        <Separator className="my-4 mx-4" />

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
