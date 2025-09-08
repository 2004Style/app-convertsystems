import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useRegisterForm } from '@/hooks/register.hook';
import * as React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Platform, Pressable, TextInput, View } from 'react-native';
import { Controller } from 'react-hook-form';

export function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  // function onSubmit() {
  //   // TODO: Submit form and navigate to protected screen if successful
  // }
  const { form, onSubmit } = useRegisterForm();
  const { control, handleSubmit: formHandleSubmit, setValue } = form;
  const [previewUrl, setPreviewUrl] = React.useState('');

  const handleSubmit = formHandleSubmit(onSubmit);

  const pickImage = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos necesarios', 'Se necesitan permisos para acceder a la galería de fotos.');
      return;
    }

    // Abrir el selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setPreviewUrl(imageUri);

      // Por ahora solo mostramos la imagen, sin enviarla al servidor
      // TODO: Implementar subida de archivos cuando sea necesario
    }
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="text-center">
              <Pressable
                onPress={pickImage}
                className={`border-2 border-dashed rounded-full w-32 h-32 mx-auto transition-colors border-border
                  ${previewUrl ? 'p-0' : 'p-4'}`}
              >
                {previewUrl ? (
                  <Image
                    source={{ uri: previewUrl }}
                    className="w-full h-full rounded-full"
                    style={{ width: 128, height: 128, borderRadius: 64 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-full flex items-center justify-center text-center text-sm text-muted-foreground">
                    <Text>Toca para seleccionar foto</Text>
                  </View>
                )}
              </Pressable>
            </View>
            <View className="gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Controller
                control={control}
                name="nombre"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                )}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="apellidos">Apellidos</Label>
              <Controller
                control={control}
                name="apellidos"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="apellidos"
                    placeholder="Tus apellidos"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                )}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="correo">Correo</Label>
              <Controller
                control={control}
                name="correo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="correo"
                    placeholder="m@example.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                )}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Controller
                control={control}
                name="telefono"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="telefono"
                    placeholder="987654321"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                )}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="direccion">Dirección</Label>
              <Controller
                control={control}
                name="direccion"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="direccion"
                    placeholder="Tu dirección"
                    autoCapitalize="words"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                )}
              />
            </View>
            <View className="gap-1.5">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
              <Controller
                control={control}
                name="fecha_nacimiento"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="fecha_nacimiento"
                    placeholder="DD/MM/AAAA"
                    value={value ? value.toLocaleDateString('es-ES') : ''}
                    onChangeText={(text) => {
                      // Convertir texto a fecha
                      const parts = text.split('/');
                      if (parts.length === 3) {
                        const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                        if (!isNaN(date.getTime())) {
                          onChange(date);
                        }
                      }
                    }}
                    onBlur={onBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                )}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="contrasena">Contraseña</Label>
              </View>
              <Controller
                control={control}
                name="contrasena"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordInputRef}
                    id="contrasena"
                    placeholder="Tu contraseña"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                    submitBehavior="submit"
                  />
                )}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="cContrasena">Confirmar Contraseña</Label>
              </View>
              <Controller
                control={control}
                name="cContrasena"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="cContrasena"
                    placeholder="Confirma tu contraseña"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit}
                  />
                )}
              />
            </View>
            <Button className="w-full" onPress={handleSubmit}>
              <Text>Continue</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
