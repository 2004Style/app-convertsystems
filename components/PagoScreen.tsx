import React, { useState } from 'react';
import { ScrollView, View, Text, Alert, Pressable, TextInput } from 'react-native';
import { seed_productos } from '@/seed/productos';
import { Productos } from '@/interfaces/interfaces';
import ProductCard from '@/components/product-card';
import { SideMenu } from '@/components/navigation/side-menu';
import { Stack } from 'expo-router';
import { AppLayout } from './navigation';

export default function PagoScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Filtrar productos de pago (con costo)
  const productosDePago = seed_productos.filter(producto => producto.precio_actual.precio > 0);
  const productosFiltrados = productosDePago.filter(producto =>
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
      `Categoria: ${producto.categorias.nombre}\nPreço: €${producto.precio_actual.precio}\n\n${producto.descripcion}`,
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
      'Comprar Produto Premium',
      `Deseja comprar "${producto.nombre}" por ${new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }).format(producto.precio_actual.precio)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Comprar', onPress: () => console.log('Comprando producto de pago:', producto.id) }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AppLayout title="Tiena de Pago">
        <ScrollView>
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
                  <View className="absolute top-2 right-2 bg-purple-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">💰 PREMIUM</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 text-lg mb-2">
                  {searchText ? 'No se encontraron productos' : 'No hay productos premium'}
                </Text>
                <Text className="text-gray-400 text-sm text-center mb-4">
                  {searchText ? 'Intenta con otros términos de búsqueda' : 'Explora nuestros productos de calidad'}
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
