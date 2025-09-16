import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { View, Image } from "react-native";
import { User, Mail, Phone, Store, Tags, Server } from "lucide-react-native";
import { Separator } from "../ui/separator";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "../ui/icon";


export const GradientBorderCard = ({
  children,
}: {
  children: React.ReactNode;
  innerClass?: string;
}) => {
  return (


    <LinearGradient
      colors={['#3366ff', '#a8ffff', '#00ff99']}
      style={{
        padding: 2,
        borderRadius: 16,
        alignSelf: 'center',
      }}
      className=' md:w-[350] w-full'
    >
      <View className=' bg-white/90 dark:bg-gray-900/90'
        style={{
          borderRadius: 14,
          alignItems: 'center',
          width: '100%',
        }}>
        {children}
      </View>
    </LinearGradient>
  );
};

// 🔹 Perfil
export function PerfilCard({ data }: {
  data: {
    id: string;
    Auth2Id: string | null;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string | null;
    direccion: string | null;
    fecha_nacimiento: Date | null;
    urlPerfil: string | null;
    contrasena: string;
    rol_id: string;
    verificado: boolean;
    roles: {
      nombre: string;
    };
    suscripcion?: any;
  }
}) {
  return (
    <GradientBorderCard>
      <Card className="w-full max-w-sm p-4 rounded-2xl bg-transparent shadow-lg">

        <CardHeader className="p-0">
          <CardTitle className="relative flex justify-between gap-4">
            <View className="flex flex-row items-center gap-2">
              <Icon as={User} className="size-5 text-black dark:text-white" />
              <Text className="text-black dark:text-white font-extrabold text-lg">PERFIL</Text>
            </View>
            <Image
              source={data.urlPerfil ? { uri: "https://api.convertsystems.store" + data.urlPerfil } : require("@/assets/images/icon.png")}
              style={{ width: 60, height: 60, borderRadius: 5 }}
              resizeMode="contain"
              className="p-0 m-0"
            />
          </CardTitle>
        </CardHeader>
        <Separator className="bg-black dark:bg-white p-0 m-0"></Separator>

        <CardContent className="gap-2 p-0">
          <View className="flex-row items-center gap-2">
            <Icon as={User} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">{data.nombre}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Mail} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">{data.correo}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Phone} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">{data.telefono}</Text>
          </View>
        </CardContent>
      </Card>
    </GradientBorderCard>
  );
}

// 🔹 Apartados
export function ApartadosCard({ data }: {
  data: {
    tienda: string;
    ofertas: string;
    gratis: string;
  }
}) {
  return (
    <GradientBorderCard >
      <Card className="w-full max-w-sm p-4 rounded-2xl bg-transparent shadow-lg">

        <CardHeader className="p-0">
          <CardTitle className="relative flex items-center justify-center gap-3">
            <Text className="text-black dark:text-white font-extrabold text-lg">Apartdos</Text>
          </CardTitle>
        </CardHeader>

        <CardContent className="gap-2 p-0">
          <View className="flex-row items-center gap-2">
            <Icon as={Store} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">Productos En Tienda: {data.tienda}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Tags} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">Productos En Ofertas: {data.ofertas}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Icon as={Server} className="size-5 text-black dark:text-white" />
            <Text className="text-black dark:text-white font-semibold">Productos Gratis: {data.gratis}</Text>
          </View>
        </CardContent>
      </Card>
    </GradientBorderCard>
  );
}
