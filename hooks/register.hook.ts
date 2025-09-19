/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import { useState } from 'react';

const FormSchema = z.object({
  code: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export function useConfirmRegisterForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Proto': 'https',
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (response.ok) {
        Alert.alert('Registro confirmado', 'Tu cuenta ha sido verificada exitosamente.');

        // Navegación compatible con React Native y Web
        if (Platform.OS === 'web') {
          window.location.href = '/sign-in-form';
        } else {
          router.push('/auth/login');
        }
      } else {
        Alert.alert('Error al confirmar el registro', res.message || 'Error desconocido');
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
    // En React Native usamos string (URI) - OBLIGATORIO según el servidor
    perfil: z.string().min(1, { message: 'La imagen de perfil es obligatoria.' }),
  })
  .refine((data: any) => data.contrasena === data.cContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['cContrasena'],
  });

export function useRegisterForm() {
  const [loading, setLoading] = useState(false);

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
      perfil: '', // Obligatorio - debe tener valor para que funcione el servidor
    },
  });

  const onSubmit = async (data: z.infer<typeof SchemaRegister>, imageUri?: string) => {

    // Verificar que todos los campos requeridos estén presentes
    if (!data.perfil || data.perfil.trim() === '') {
      console.error('ERROR: Campo perfil vacío');
      Alert.alert('Error', 'Debe seleccionar una imagen de perfil');
      return;
    }

    try {
      setLoading(true);
      // Crear FormData igual que en la web
      const formData = new FormData();

      formData.append('nombre', data.nombre);
      formData.append('apellidos', data.apellidos);
      formData.append('correo', data.correo);
      formData.append('telefono', data.telefono);
      formData.append('direccion', data.direccion);
      // Fecha en formato que puede parsear new Date() en el servidor
      const fechaFormateada = data.fecha_nacimiento.toISOString().split('T')[0]; // YYYY-MM-DD
      formData.append('fecha_nacimiento', fechaFormateada);
      formData.append('contrasena', data.contrasena);

      // Imagen OBLIGATORIA - el servidor siempre espera un archivo 'perfil'
      if (data.perfil) {
        const filename = data.perfil.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // En web, necesitamos crear un objeto File similar al nativo
        if (Platform.OS === 'web') {
          // Para web, crear un Blob/File desde la URI
          try {
            console.log('Creando archivo web...');
            const response = await fetch(data.perfil);
            const blob = await response.blob();
            const file = new File([blob], filename, { type });
            formData.append('perfil', file);
            console.log('Archivo web configurado:', { name: filename, type, size: blob.size });
          } catch (error) {
            console.error('Error creando archivo web:', error);
            Alert.alert('Error', 'No se pudo procesar la imagen');
            return;
          }
        } else {
          // Para React Native nativo
          formData.append('perfil', {
            uri: data.perfil,
            name: filename,
            type: type,
          } as any);
          console.log('Archivo RN configurado:', { uri: data.perfil, name: filename, type: type });
        }
      } else {
        console.error('ERROR: No hay imagen seleccionada pero es obligatoria');
        Alert.alert('Error', 'La imagen de perfil es obligatoria para el registro');
        return;
      }

      // Usar fetch directo igual que en la web (SIN headers Content-Type)
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          // No Content-Type para que el navegador establezca el boundary automáticamente
          Accept: 'application/json',
        },
        body: formData,
        // No incluir credentials en React Native
      });

      const res = await response.json();

      if (response.ok) {
        Alert.alert('Registro exitoso', 'Por favor revisa tu correo para confirmar tu cuenta.', [
          {
            text: 'OK',
            onPress: () => {
              // Navegación compatible con React Native y Web
              if (Platform.OS === 'web') {
                window.location.href = '/sign-in-form';
              } else {
                router.push('/auth/login');
              }
            },
          },
        ]);
      } else {
        console.error('=== ERROR DEL SERVIDOR ===');
        console.error('Status:', response.status);
        console.error('StatusText:', response.statusText);
        console.error('Error body:', res);

        const errorMessage = res.message || res.error || `Error del servidor (${response.status})`;
        Alert.alert('Error al registrar', errorMessage);
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      Alert.alert('Error al registrar', error.toString());
    } finally {
      setLoading(false);
    }
  };

  return { form, onSubmit, loading };
}
