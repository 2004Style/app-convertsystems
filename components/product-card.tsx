import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Productos } from '@/interfaces/interfaces';

interface ProductCardProps {
  producto: Productos;
  onPress?: (producto: Productos) => void;
  onLike?: (producto: Productos) => void;
  onBuy?: (producto: Productos) => void;
}

export default function ProductCard({ 
  producto, 
  onPress, 
  onLike, 
  onBuy 
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getVersionSize = () => {
    if (producto.versiones.length > 0) {
      return producto.versiones[0].size;
    }
    return '0 MB';
  };

  const getVersion = () => {
    if (producto.versiones.length > 0) {
      return producto.versiones[0].numero_version;
    }
    return '1.0.0';
  };

  return (
    <Card className="mx-4 my-2 bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      <Pressable onPress={() => onPress?.(producto)}>
        
        {/* Header con gradiente y logo */}
        <View className="relative h-32">
          <View className="absolute inset-0 bg-gradient-to-br from-blue-400 via-teal-400 to-green-400 rounded-t-xl" />
          
          {/* Badge de tipo de producto en la esquina superior izquierda */}
          <View className="absolute top-3 left-3">
            <View className="bg-blue-500 px-2 py-1 rounded transform -rotate-12">
              <Text className="text-white text-xs font-bold">
                {producto.precio_actual.precio === 0 ? 'GRATIS' : 'PAGO'}
              </Text>
            </View>
          </View>

          {/* Badge de descuento en la esquina superior derecha */}
          {producto.oferta && (
            <View className="absolute top-3 right-3">
              <View className="bg-purple-600 px-3 py-1 rounded-lg">
                <Text className="text-white text-sm font-bold">
                  {producto.precio_actual.descuento}%
                </Text>
              </View>
            </View>
          )}

          {/* Logo/Icono centrado */}
          <View className="absolute inset-0 flex-1 justify-center items-center">
            <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <Text className="text-2xl">🔥</Text>
            </View>
            <Text className="text-white font-bold mt-2 text-lg tracking-wide">
              ConvertSystems
            </Text>
          </View>
        </View>

        {/* Contenido principal */}
        <View className="p-4 bg-gray-800">
          
          {/* Nombre del producto */}
          <Text className="text-green-400 font-bold text-lg mb-1">
            {producto.nombre}
          </Text>
          
          {/* Categoría */}
          <Text className="text-red-400 text-sm mb-2 capitalize">
            {producto.categorias.nombre}
          </Text>

          {/* Precios */}
          <View className="flex-row items-center mb-2">
            {producto.oferta ? (
              <>
                <Text className="text-gray-400 line-through text-lg mr-2">
                  {formatPrice(producto.precio)}
                </Text>
                <Text className="text-green-400 font-bold text-xl">
                  {formatPrice(producto.precio_actual.precio)}
                </Text>
              </>
            ) : (
              <Text className="text-white font-bold text-xl">
                {producto.precio_actual.precio === 0 ? 'GRATIS' : formatPrice(producto.precio_actual.precio)}
              </Text>
            )}
          </View>

          {/* Descripción */}
          <Text className="text-gray-300 text-sm mb-4" numberOfLines={3}>
            {producto.descripcion}
          </Text>

          {/* Información técnica */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Text className="text-white font-medium text-sm mr-4">
                {getVersion()}
              </Text>
              <Text className="text-gray-400 text-sm mr-4">
                {getVersionSize()}
              </Text>
              <Text className="text-gray-400 text-sm">
                {formatDate(producto.fecha_registro)}
              </Text>
            </View>
          </View>

          {/* Botón de acción */}
          <Button 
            onPress={() => onBuy?.(producto)}
            className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3"
          >
            <Text className="text-white font-medium text-center">
              Ver Información
            </Text>
          </Button>

        </View>
      </Pressable>
    </Card>
  );
}
