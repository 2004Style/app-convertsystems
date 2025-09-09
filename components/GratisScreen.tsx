import React, { useState } from 'react';
import { ScrollView, View, Text, Alert, Pressable, TextInput } from 'react-native';
import { seed_productos } from '@/seed/productos';
import { Productos } from '@/interfaces/interfaces';
import ProductCard from '@/components/product-card';
import { SideMenu } from '@/components/navigation/side-menu';
import { Stack } from 'expo-router';
import { AppLayout } from './navigation';

export default function GratisScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Filtrar productos gratis (sin costo)
  const productosGratis = seed_productos.filter(producto => producto.precio === 0);
  const productosFiltrados = productosGratis.filter(producto =>
    producto.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(searchText.toLowerCase()) ||
    producto.categorias.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  const handleProductPress = (producto: Productos) => {
    Alert.alert(
      producto.nombre,
      `Categoria: ${producto.categorias.nombre}\nProduto GRATUITO!\n\n${producto.descripcion}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ver Detalhes', onPress: () => console.log('Ver detalhes:', producto.id) }
      ]
    );
  };

  const handleLike = (producto: Productos) => {
    Alert.alert('Like', `${producto.like ? 'Removido' : 'Adicionado'} like no produto: ${producto.nombre}`);
  };

  const handleBuy = (producto: Productos) => {
    Alert.alert(
      'Descargar Gratis',
      `¿Deseas descargar "${producto.nombre}" de forma gratuita?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Descargar', onPress: () => console.log('Descargando gratis:', producto.id) }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AppLayout title="Tienda Gratis">
        <ScrollView className="flex-1 bg-gray-900">
          {/* Barra de búsqueda con menú */}
          <View className="bg-purple-600 p-4">
            <View className="bg-gray-800 rounded-lg p-3 flex-row items-center flex-1">
              <Text className="text-gray-400 mr-2">🔍</Text>
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Buscar productos..."
                placeholderTextColor="#9CA3AF"
                className="text-white flex-1 min-w-[48px]"
                style={{ fontSize: 16 }}
              />
            </View>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <View key={producto.id} className="relative">
                  <ProductCard
                    producto={producto}
                    onPress={handleProductPress}
                    onLike={handleLike}
                    onBuy={handleBuy}
                  />
                  <View className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">🆓 GRATIS</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 text-lg mb-2">
                  {searchText ? 'No se encontraron productos' : 'No hay productos gratuitos'}
                </Text>
                <Text className="text-gray-400 text-sm text-center mb-4">
                  {searchText ? 'Intenta con otros términos de búsqueda' : 'Explora nuestra selección de productos sin costo'}
                </Text>
              </View>
            )}
          </ScrollView>

          <SideMenu
            visible={menuVisible}
            onClose={handleMenuClose}
          />
        </ScrollView>
      </AppLayout>

    </>

  );
}
