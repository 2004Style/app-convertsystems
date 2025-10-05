import React, { useEffect, useRef } from 'react';
import { Stack, router } from 'expo-router';
import { View, Animated, Linking, ScrollView } from 'react-native';
import GradientText from '@/components/gradientes/texto';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { AlertTriangle, Home, Bug } from 'lucide-react-native';
import { AppLayout } from '@/components/navigation';

export default function NotFoundScreen() {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const goHome = () => router.push('/');

  const reportIssue = async () => {
    const mail = 'mailto:soporte@convertsystems.store?subject=Página%20no%20disponible&body=He%20encontrado%20la%20página%20no%20disponible%20en%20la%20app.';
    try {
      await Linking.openURL(mail);
    } catch (e) {
      router.push('/');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Página no disponible', headerShown: false }} />
      <AppLayout title="Página no disponible">
        <ScrollView>
          <View className="w-full max-w-md p-6 items-center">
            <View className="mt-4 mb-2 items-center">
              <GradientText texto="Error 404" fontsize={28} padding={8} colors={["#ffd166", "#ff6b6b", "#9b5de5"]} />
              <Text variant="p" className="text-center text-foreground">Lo sentimos — el contenido que buscas no está disponible en este momento.</Text>
            </View>

            <View className="flex-row w-full gap-3">
              <Button onPress={goHome} variant="default" className="flex-1">
                <View className="flex-row items-center justify-center gap-2">
                  <Icon as={Home} size={16} />
                  <Text>Ir al inicio</Text>
                </View>
              </Button>

              <Button onPress={reportIssue} variant="outline" className="flex-1">
                <View className="flex-row items-center justify-center gap-2">
                  <Icon as={Bug} size={16} />
                  <Text>Reportar</Text>
                </View>
              </Button>
            </View>

            <View className="mt-4">
              <Text variant="small" className="text-center text-foreground">Puedes intentar recargar la página o volver más tarde.</Text>
            </View>
          </View>
        </ScrollView>
      </AppLayout >
    </>
  );
}
