import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { ArrowLeft, Menu, MoonIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, View } from 'react-native';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    showMenu?: boolean;
    onMenuPress?: () => void;
}

export function Header({
    title,
    showBackButton = false,
    showMenu = true,
    onMenuPress
}: HeaderProps) {
    const { colorScheme, toggleColorScheme } = useColorScheme();


    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <View className="flex-row items-center justify-between p-4 bg-background border-b border-border">
            {/* Lado izquierdo */}
            <View className="flex-row items-center flex-1">
                {(showBackButton) && (
                    <Button
                        size="icon"
                        variant="ghost"
                        onPress={handleBack}
                        className="mr-2"
                    >
                        <Icon as={ArrowLeft} className="size-5" />
                    </Button>
                )}

                {title && (
                    <Text className="text-lg font-semibold ml-2">{title}</Text>
                )}
            </View>

            {/* Lado derecho */}
            <View className="flex-row items-center">
                {/* Toggle de tema */}
                <Button
                    onPress={toggleColorScheme}
                    size="icon"
                    variant="ghost"
                    className="mr-2"
                >
                    <Icon
                        as={colorScheme === 'dark' ? SunIcon : MoonIcon}
                        className="size-5"
                    />
                </Button>

                {/* Menú hamburguesa */}
                {showMenu && onMenuPress && (
                    <Button
                        size="icon"
                        variant="ghost"
                        onPress={onMenuPress}
                    >
                        <Icon as={Menu} className="size-5" />
                    </Button>
                )}
            </View>
        </View>
    );
}
