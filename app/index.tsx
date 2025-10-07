import { AppLayout } from '@/components/navigation/app-layout';
import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { ApartadosCard, PerfilCard } from '@/components/Cards-Home/cards';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useEffect, useState } from 'react';
import { DataCarruselWelcome, NativeCarousel } from '@/components/Cards-Home/native-carousel';
import { formatearFechaParaString } from '@/utils/formatearFecha';
import { Clock, Database, DollarSign, Download, GitBranch } from 'lucide-react-native';

interface apartados {
  tienda: string;
  ofertas: string;
  gratis: string;
}

interface masNuevo {
  producto: string;
  descripcion: string;
  precio: string;
  fecha_registro: string;
  categoria: string;
  version: string;
  tamaño: string;
}

interface masDescargado {
  version: string;
  size: string;
  producto: string;
  categoria: string;
  descripcion: string;
  descargas: string;
}

 export default function Screen() {
   const { session } = useAuth();
   const socket = useSocket();

   const [apartados, setApartados] = useState<apartados | null>(null);
   const [masNuevo, setMasNuevo] = useState<DataCarruselWelcome[]>([]);
   const [masDescargado, setmasDescargado] = useState<DataCarruselWelcome[]>([]);

   useEffect(() => {
     if (!socket) return;

     const handleApartados = (data: apartados) => {
       if (data.tienda === '0' && data.ofertas === '0' && data.gratis === '0') return;
       setApartados(data);
     };

     const handleMasNuevo = (data: masNuevo[]) => {
       if (data.length === 0) return;
       const transformado: DataCarruselWelcome[] = data.map(item => ({
         title_card: `Mas Nuevo`,
         nombre: item.producto,
         categoria: item.categoria,
         descripcion: item.descripcion,
         version: [
           { item: item.precio, icon: DollarSign },
           { item: item.version, icon: GitBranch },
           { item: item.tamaño, icon: Database },
           { item: formatearFechaParaString(item.fecha_registro), icon: Clock },
         ],
       }));
       setMasNuevo(transformado);
     };

     const handleMasDescargado = (data: masDescargado[]) => {
       if (data.length === 0) return;
       const transformado: DataCarruselWelcome[] = data.map(item => ({
         title_card: `Mas Descargado`,
         nombre: item.producto,
         categoria: item.categoria,
         descripcion: item.descripcion,
         version: [
           { item: item.descargas, icon: Download },
           { item: item.version, icon: GitBranch },
           { item: item.size, icon: Database },
         ],
       }));
       setmasDescargado(transformado);
     };

     socket.emit("welcome");
     socket.on('Apartados', handleApartados);
     socket.on('masNuevo', handleMasNuevo);
     socket.on('masDescargado', handleMasDescargado);

     // Función de limpieza para evitar fugas de memoria
     return () => {
       socket.off('Apartados', handleApartados);
       socket.off('masNuevo', handleMasNuevo);
       socket.off('masDescargado', handleMasDescargado);
     };
   }, [socket]);


   return (
     <>
       <Stack.Screen options={{ headerShown: false }} />
       <AppLayout title="ConvertSystems" showBackButton={true}>
         <ScrollView className="flex-1" contentContainerStyle={{ padding: 8 }}>
           <View className="items-center gap-6 w-full">
             {session?.user !== null && session?.user !== undefined &&
               <View className="w-full p-5">
                 <PerfilCard data={session.user} />
               </View>
             }
             {apartados !== null &&
               <View className='w-full p-5'>
                 <ApartadosCard data={apartados} />
               </View>
             }
             {masDescargado.length > 0 && (
               <View className="w-full">
                 <NativeCarousel data={masDescargado} autoPlayDelay={4000} />
               </View>
             )}
             {masNuevo.length > 0 && (
               <View className="w-full">
                 <NativeCarousel data={masNuevo} autoPlayDelay={4000} />
               </View>
             )}
           </View>
         </ScrollView>
       </AppLayout>
     </>
   );
 }