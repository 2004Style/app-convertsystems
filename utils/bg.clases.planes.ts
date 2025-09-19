import { class_planes } from '@/class/planes/planes.class';

export interface ColorBgRadial {
  Color1: string;
  Color2: string;
  Color3: string;
  foreground: string;
}

export function bg_planesGradient(plan: string): ColorBgRadial {
  return {
    Color1:
      plan == class_planes.premium
        ? '#e6163f'
        : plan == class_planes.vip
          ? '#ff8c00'
          : plan == class_planes.basic
            ? '#ffff00'
            : '#40e0d0',
    Color2:
      plan == class_planes.premium
        ? '#800020'
        : plan == class_planes.vip
          ? '#ff0000'
          : plan == class_planes.basic
            ? '#7cfc00'
            : '#000080',
    Color3:
      plan == class_planes.premium
        ? '#66001A' // Burdeos oscuro
        : plan == class_planes.vip
          ? '#B20000' // Rojo profundo
          : plan == class_planes.basic
            ? '#5FAF00' // Verde oscuro
            : '#000066', // Azul marino más profundo
    foreground:
      plan == class_planes.premium
        ? '#ffffff'
        : plan == class_planes.vip
          ? '#ffffff'
          : plan == class_planes.basic
            ? '#000000'
            : '#ffffff',
  };
}
