/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthActions } from './useAuthActions';
import { useCosultaApi } from './datosApi.hook';

const FormSchema = z.object({
  code: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export function useConfirmRegisterForm() {
  const { request } = useCosultaApi();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await request('POST', '/auth/register/confirm', {}, data);

      if (response.alert === 'success') {
        Alert.alert('Registro confirmado', 'Tu cuenta ha sido verificada exitosamente.');

        // Navegación compatible con React Native y Web
        if (Platform.OS === 'web') {
          window.location.href = '/sign-in-form';
        } else {
          router.push('/sign-in-form');
        }
      } else {
        Alert.alert('Error al confirmar el registro', response.message || 'Error desconocido');
      }
    } catch (error: any) {
      Alert.alert('Error al confirmar el registro', error.toString());
    }
  };

  return { form, onSubmit };
}

const SchemaRegister = z
  .object({
    nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
    apellidos: z.string().min(3, { message: 'El apellido debe tener al menos 3 caracteres.' }),
    correo: z.string().email({ message: 'Ingresa un correo válido' }),
    telefono: z
      .string()
      .length(9, { message: 'El teléfono debe tener exactamente 9 caracteres.' })
      .regex(/^\d+$/, { message: 'Debe contener solo números' }),
    direccion: z
      .string()
      .min(4, { message: 'La dirección debe tener al menos 4 caracteres.' })
      .max(20, { message: 'La dirección debe tener máximo 20 caracteres.' }),
    fecha_nacimiento: z.date({ message: 'La fecha de nacimiento no es válida.' }),
    contrasena: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    cContrasena: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  })
  .refine((data: any) => data.contrasena === data.cContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['cContrasena'],
  });

export function useRegisterForm() {
  const { register } = useAuthActions();

  const form = useForm<z.infer<typeof SchemaRegister>>({
    resolver: zodResolver(SchemaRegister),
    shouldUnregister: false,
    defaultValues: {
      nombre: '',
      apellidos: '',
      correo: '',
      telefono: '',
      direccion: '',
      fecha_nacimiento: new Date(),
      contrasena: '',
      cContrasena: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof SchemaRegister>) => {
    console.log('Datos enviados:', data);

    try {
      // Preparar los datos para el registro
      const registerData = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        correo: data.correo,
        telefono: data.telefono,
        direccion: data.direccion,
        fecha_nacimiento: data.fecha_nacimiento,
        contrasena: data.contrasena,
      };

      const result = await register(registerData);

      if (result.alert === 'success') {
        Alert.alert('Registro exitoso', 'Por favor revisa tu correo para confirmar tu cuenta.', [
          {
            text: 'OK',
            onPress: () => {
              // Navegación compatible con React Native y Web
              if (Platform.OS === 'web') {
                window.location.href = '/sign-in-form';
              } else {
                router.push('/sign-in-form');
              }
            },
          },
        ]);
      } else {
        Alert.alert('Error al registrar', result.message || 'Error desconocido');
      }
    } catch (error: any) {
      Alert.alert('Error al registrar', error.toString());
    }
  };

  return { form, onSubmit };
}
