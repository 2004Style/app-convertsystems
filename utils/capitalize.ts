// utils/capitalize.ts

/**
 * Convierte la primera letra de cada palabra en mayúscula.
 * @param text - El texto a capitalizar.
 * @returns El texto con cada palabra capitalizada.
 */
export function capitalize(text: string): string {
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}