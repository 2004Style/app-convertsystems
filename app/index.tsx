import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { AppLayout } from '@/components/navigation/app-layout';
import { Link, Stack } from 'expo-router';
import { StarIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AppLayout title="ConvertSystems">
        <View className="flex-1 items-center justify-center gap-8 p-4">
          <Image source={LOGO[colorScheme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
          <View className="gap-2 p-4 text-center">
            <Text className="text-2xl font-bold text-center mb-2">
              Bienvenido a ConvertSystems
            </Text>
            <Text className="text-center text-muted-foreground mb-4">
              Tu plataforma integral para soluciones digitales
            </Text>
          </View>

          <View className="gap-4 w-full max-w-sm">
            <Link href="/sign-in-form" asChild>
              <Button size="lg" className="w-full">
                <Text>Iniciar Sesión</Text>
              </Button>
            </Link>

            <Link href="/sing-up-form" asChild>
              <Button size="lg" variant="outline" className="w-full">
                <Text>Crear Cuenta</Text>
              </Button>
            </Link>
          </View>

          <View className="flex-row gap-2 mt-8">
            <Link href="https://reactnativereusables.com" asChild>
              <Button variant="ghost" size="sm">
                <Text>Documentación</Text>
              </Button>
            </Link>

            <Link href="https://github.com/founded-labs/react-native-reusables" asChild>
              <Button variant="ghost" size="sm">
                <Text>GitHub</Text>
                <Icon as={StarIcon} className="ml-1 size-4" />
              </Button>
            </Link>
          </View>
        </View>
      </AppLayout>
    </>
  );
}
