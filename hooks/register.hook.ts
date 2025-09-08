/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegistroB_Public } from '@/routes/public.routes';
import { RegistroConfirmarB_Client } from '@/routes/user.routes';
import { PbLogin, PbRegisterConfirm } from '@/routes/Frontend.routes';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';

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
    //console.log("Datos enviados:", data);

    try {
      const response: any = await fetch(RegistroConfirmarB_Client, {
        method: `POST`,
        headers: {
          // Authorization: `Bearer ${accessToken}`,
          // Refresh: `${refreshToken}`,
          'Content-Type': 'application/json',
          'X-Forwarded-Proto': 'https',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (!response.ok) {
        return Alert.alert('error al confirmar el registro', res.message);
      }

      // Navegación compatible con React Native y Web
      if (Platform.OS === 'web') {
        window.location.href = PbLogin;
      } else {
        router.push('/sign-in-form');
      }
    } catch (error: any) {
      return Alert.alert('error al confirmar el registro', error.toString());
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
      // Crear el objeto de datos para enviar
      const submitData: any = {
        nombre: data.nombre,
        apellidos: data.apellidos,
        correo: data.correo,
        telefono: data.telefono,
        direccion: data.direccion,
        fecha_nacimiento: data.fecha_nacimiento.toISOString(),
        contrasena: data.contrasena,
      };

      let response: any;

      if (Platform.OS === 'web') {
        // En web, usar FormData
        const formData = new FormData();
        Object.keys(submitData).forEach((key) => {
          formData.append(key, submitData[key]);
        });

        response = await fetch(RegistroB_Public, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
      } else {
        // En React Native, usar JSON
        response = await fetch(RegistroB_Public, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });
      }

      const res = await response.json();

      if (!response.ok) {
        return Alert.alert('error al enviar los datos', res.message);
      }

      // Navegación compatible con React Native y Web
      if (Platform.OS === 'web') {
        window.location.href = PbRegisterConfirm;
      } else {
        Alert.alert('Registro exitoso', 'Por favor revisa tu correo para confirmar tu cuenta.');
        router.push('/sign-in-form');
      }
    } catch (error: any) {
      return Alert.alert('error al enviar los datos', error.toString());
    }
  };

  return { form, onSubmit };
}
