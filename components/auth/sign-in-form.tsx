import { SocialConnections } from '@/components/social-connections';
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
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useAuthActions } from '@/hooks/useAuthActions';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { Alert } from 'react-native';
import { Pressable, type TextInput, View } from 'react-native';


export function SignInForm() {
  const { login, loading, isAuthenticated } = useAuthActions();
  const passwordInputRef = React.useRef<TextInput>(null);

  // Estados para los inputs
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  const handleLogin = async () => {
    try {
      const result = await login({
        username: username,
        password: password,
      });

      if (result.alert === 'success') {
        // Alert.alert('Éxito', 'Login exitoso');
        return router.replace('/');

      } else {
        Alert.alert('Error', result.message || 'Error en el login');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión');
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  function onSubmit() {
    handleLogin();
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader className='items-center'>
          <CardTitle className="text-center text-xl sm:text-left">Bienvenido de nuevo</CardTitle>
          <CardDescription className="text-center sm:text-left">
            inicia sesion con tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="username">email o usuario</Label>
              <Input
                id="username"
                placeholder="m@example.com"
                autoCapitalize="none"
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() => {
                    // TODO: Navigate to forgot password screen
                  }}>
                  <Text className="font-normal leading-4">Olvidaste tu contraseña?</Text>
                </Button>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={loading}>
              <Text>{loading ? 'Iniciando sesión...' : 'Login'}</Text>
            </Button>
          </View>
          {/* <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">Continuar con</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections /> */}
          <Text className="text-center items-center justify-center text-sm">
            No tienes una cuenta aún?{' '}
            <Link href="/auth/register" className="text-sm underline underline-offset-4">Registrar</Link>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
