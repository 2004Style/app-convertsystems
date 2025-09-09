import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View, Image } from "react-native";
import { User, Mail, Phone, Database, Download, Tag } from "lucide-react-native";
import { Icon } from '@/components/ui/icon';


const GradientBorderCard = ({ 
  children, 
  colors, 
  innerClass = "" 
}: { 
  children: React.ReactNode; 
  colors: string; 
  innerClass?: string;
}) => {
  return (
    <View className={`rounded-2xl p-[2px] bg-gradient-to-r ${colors}`}>
      <View className={`rounded-2xl bg-white/90 dark:bg-gray-900/90 ${innerClass}`}>
        {children}
      </View>
    </View>
  );
};

// 🔹 Perfil
export function PerfilCard() {
  return (
    <GradientBorderCard colors="from-indigo-500 via-purple-500 to-pink-500">
      <Card className="w-full max-w-sm p-4 rounded-2xl bg-transparent shadow-lg">
        <CardHeader className="border-b border-white/20 pb-2">
          <CardTitle className="flex-row items-center">
            <Icon as={User} className="size-5 mr-2 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-extrabold text-lg">PERFIL</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-3 mt-3">
          <View className="flex-row items-center gap-2">
            <Icon as={User} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">Ruben</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Mail} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">user@cs.dev</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Phone} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">1234567890</Text>
          </View>
          <View className="items-center mt-4">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: 60, height: 60, borderRadius: 9999 }}
              resizeMode="contain"
            />
          </View>
        </CardContent>
      </Card>
    </GradientBorderCard>
  );
}

// 🔹 Más Nuevo
export function MasNuevoCard({ producto }: { producto: any }) {
  return (
    <GradientBorderCard colors="from-cyan-500 via-sky-500 to-blue-500">
      <Card className="w-full max-w-sm p-4 rounded-2xl bg-transparent shadow-lg">
        <CardHeader className="border-b border-white/20 pb-2">
          <CardTitle className="flex-row items-center">
            <Icon as={Database} className="size-5 mr-2 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-extrabold text-lg">MAS NUEVO</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-2 mt-3">
          <View className="flex-row items-center gap-2">
            <Icon as={Database} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-bold">{producto.nombre}</Text>
          </View>
          <Text className="text-black dark:text-white/90">{producto.descripcion}</Text>
          <Text className="text-black dark:text-white font-semibold">💲 {producto.precio}</Text>
          <Text className="text-black dark:text-white">📌 {producto.version}</Text>
          <Text className="text-black dark:text-white">📦 {producto.peso}</Text>
          <Text className="text-black dark:text-white">📅 {producto.fecha}</Text>
        </CardContent>
      </Card>
    </GradientBorderCard>
  );
}

// 🔹 Más Descargado
export function MasDescargadoCard({ producto }: { producto: any }) {
  return (
    <GradientBorderCard colors="from-green-400 via-emerald-500 to-teal-500">
      <Card className="w-full max-w-sm p-4 rounded-2xl bg-transparent shadow-lg">
        <CardHeader className="border-b border-white/20 pb-2">
          <CardTitle className="flex-row items-center">
            <Icon as={Download} className="size-5 mr-2 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-extrabold text-lg">MAS DESCARGADO</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-2 mt-3">
          <View className="flex-row items-center gap-2">
            <Icon as={Download} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-bold">{producto.nombre}</Text>
          </View>
          <Text className="text-black dark:text-white">📂 {producto.categoria}</Text>
          <Text className="text-black dark:text-white font-semibold">⬇️ {producto.descargas} descargas</Text>
          <Text className="text-black dark:text-white">📌 {producto.version}</Text>
          <Text className="text-black dark:text-white">📦 {producto.peso}</Text>
        </CardContent>
      </Card>
    </GradientBorderCard>
  );
}

// 🔹 Apartados
export function ApartadosCard() {
  return (
    <GradientBorderCard colors="from-orange-400 via-red-500 to-pink-600">
      <Card className="w-full max-w-sm p-4 rounded-2xl bg-transparent shadow-lg">
        <CardHeader className="border-b border-white/20 pb-2">
          <CardTitle className="flex-row items-center">
            <Icon as={Tag} className="size-5 mr-2 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-extrabold text-lg">APARTADOS</Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-2 mt-3">
          <View className="flex-row items-center gap-2">
            <Icon as={Tag} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">Productos en Tienda: 2</Text>
          </View>
          <Text className="text-black dark:text-white">🎉 Productos en Ofertas: 0</Text>
          <Text className="text-black dark:text-white">🆓 Productos Gratis: 4</Text>
        </CardContent>
      </Card>
    </GradientBorderCard>
  );
}
