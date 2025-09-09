import { Text } from '@/components/ui/text';
import { AppLayout } from '@/components/navigation/app-layout';
import { Link, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, ScrollView, View } from 'react-native';

import { ApartadosCard, MasDescargadoCard, MasNuevoCard, PerfilCard } from '@/components/Cards-Home/cards';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};
const productosNuevos = [
  {
    nombre: "Producto X",
    descripcion: "Versión demo",
    precio: 0,
    version: "1.0.0",
    peso: "458.35 KB",
    fecha: "07/07/2025"
  },
  {
    nombre: "Producto Z",
    descripcion: "Versión premium",
    precio: 10,
    version: "2.0.0",
    peso: "1.2 MB",
    fecha: "08/07/2025"
  },
  {
    nombre: "Producto W",
    descripcion: "Edición especial",
    precio: 5,
    version: "1.5.0",
    peso: "800 KB",
    fecha: "06/07/2025"
  }
];

const productosDescargados = [
  {
    nombre: "Producto Y",
    categoria: "Web",
    descargas: 6,
    version: "1.0.0",
    peso: "3.72 KB"
  },
  {
    nombre: "Producto A",
    categoria: "Mobile",
    descargas: 12,
    version: "2.1.0",
    peso: "5.1 MB"
  },
  {
    nombre: "Producto B",
    categoria: "Desktop",
    descargas: 8,
    version: "1.8.0",
    peso: "10.5 MB"
  }
];

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const [productoNuevoIndex, setProductoNuevoIndex] = React.useState(0);
  const [productoDescargadoIndex, setProductoDescargadoIndex] = React.useState(0);

  // Cambiar producto cada 5 segundos
  React.useEffect(() => {
    const interval = setInterval(() => {
      setProductoNuevoIndex(prev => (prev + 1) % productosNuevos.length);
      setProductoDescargadoIndex(prev => (prev + 1) % productosDescargados.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AppLayout title="ConvertSystems">
        <ScrollView className="flex-1 p-4">
          <View className="items-center justify-center gap-8 p-4">
            <Image source={LOGO[colorScheme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
            <View className="gap-2 p-4 text-center">
              <Text className="text-2xl font-bold text-center mb-2">
                ConvertSystems
              </Text>
              <Text className="text-center text-muted-foreground mb-4">
                Developer Sistem
              </Text>
            </View>
            <View className="gap-4">
              <PerfilCard />
              <MasNuevoCard producto={productosNuevos[productoNuevoIndex]} />
              <ApartadosCard />
              <MasDescargadoCard producto={productosDescargados[productoDescargadoIndex]} />
            </View> 
          </View>
        </ScrollView>
      </AppLayout>
    </>
  );
}
