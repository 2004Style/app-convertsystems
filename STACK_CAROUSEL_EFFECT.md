# Carrusel con Efecto Stack - Documentación

## 🎨 Efecto Implementado

He creado un carrusel con **efecto de stack apilado** donde las tarjetas salen hacia adelante con animaciones de profundidad, creando un efecto visual muy elegante donde:

1. **Las tarjetas están apiladas** unas detrás de otras
2. **La tarjeta frontal sale hacia adelante** con rotación y escala
3. **Se desvanece gradualmente** mientras sale de la pantalla
4. **La siguiente tarjeta emerge** desde atrás del stack
5. **Efecto infinito** que se repite automáticamente

## ✨ Características del Efecto

### Animaciones Múltiples Simultáneas

```typescript
Animated.parallel([
  // Movimiento hacia arriba
  Animated.timing(currentCard.translateY, {
    toValue: -50,
    duration: 600,
    useNativeDriver: true,
  }),
  // Escalado (zoom out)
  Animated.timing(currentCard.scale, {
    toValue: 1.1,
    duration: 600,
    useNativeDriver: true,
  }),
  // Desvanecimiento
  Animated.timing(currentCard.opacity, {
    toValue: 0,
    duration: 600,
    useNativeDriver: true,
  }),
  // Rotación sutil
  Animated.timing(currentCard.rotate, {
    toValue: 5,
    duration: 600,
    useNativeDriver: true,
  }),
]);
```

### Stack con Profundidad

- **Tarjeta 1 (frontal):** Escala 1.0, translateY: 0, zIndex: 10
- **Tarjeta 2 (medio):** Escala 0.95, translateY: 8px, zIndex: 9
- **Tarjeta 3 (atrás):** Escala 0.90, translateY: 16px, zIndex: 8

### Reorganización Automática

```typescript
const animateStackReorganization = () => {
  cardAnimations.forEach((animation, index) => {
    const relativeIndex = (index - currentIndex + data.length) % data.length;

    if (relativeIndex === 0) {
      // Tarjeta principal (al frente)
      // Scale: 1, translateY: 0
    } else if (relativeIndex <= 2) {
      // Tarjetas en el stack (atrás)
      // Scale: reducida, translateY: aumentado
    }
  });
};
```

## 🎯 Interacciones

### Auto-Play Inteligente

- **Intervalo configurable:** 3000ms por defecto
- **Animación fluida:** 600ms de duración
- **Reseteo automático:** Las tarjetas vuelven al stack

### Controles Manuales

- **Toque en tarjeta frontal:** Avanza al siguiente
- **Indicadores de paginación:** Navegación directa
- **Botón "Siguiente":** Control manual adicional

### Indicadores Visuales

- **Dots interactivos** que cambian de color
- **Posición actual** resaltada en azul
- **Navegación directa** tocando cualquier indicador

## 🔧 Componentes Técnicos

### Estructura del Stack

```tsx
<View style={styles.stackContainer}>
  {data.map((item, index) => renderStackedCard(item, index))}
</View>
```

### Cálculo de Posición Relativa

```typescript
const relativeIndex = (index - currentIndex + data.length) % data.length;
const zIndex = 10 - relativeIndex;
```

### Transformaciones Animadas

```tsx
<Animated.View
    style={[
        styles.stackedCard,
        {
            zIndex,
            transform: [
                { translateY: animation.translateY },
                { scale: animation.scale },
                { rotate: animation.rotate.interpolate({
                    inputRange: [0, 10],
                    outputRange: ['0deg', '10deg'],
                }) },
            ],
            opacity: animation.opacity,
        },
    ]}
>
```

## 🎨 Efectos Visuales

### Sombras y Elevación

```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.2,
shadowRadius: 6,
elevation: 8,
```

### Gradientes Mantenidos

- **Borde degradado:** `#6ff6f1 → #a8ffff → #00ff99`
- **Contenido adaptable:** Claro/Oscuro según tema
- **Bordes redondeados:** 16px exterior, 14px interior

### Transiciones Suaves

- **useNativeDriver: true** para máximo rendimiento
- **Duración optimizada:** 600ms salida, 400ms reorganización
- **Interpolación natural:** Rotación gradual 0° → 10°

## 📱 Responsive Design

### Dimensiones Adaptables

```typescript
const { width: screenWidth } = Dimensions.get('window');
// Ancho del stack: 90% del screen con máximo 350px
width: '90%',
maxWidth: 350,
```

### Layout Centrado

```typescript
stackContainer: {
    height: 300,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
},
```

## 🔄 Flujo de Animación

### Secuencia Completa

1. **Inicio:** Tarjeta frontal en posición normal
2. **Trigger:** Auto-play o toque manual
3. **Animación de salida:** translateY, scale, opacity, rotate
4. **Cambio de índice:** Actualización del estado
5. **Reorganización:** Todas las tarjetas se reposicionan
6. **Finalización:** Nueva tarjeta frontal lista

### Gestión de Memoria

```typescript
// Resetear la tarjeta que salió
currentCard.translateY.setValue(0);
currentCard.scale.setValue(1);
currentCard.opacity.setValue(1);
currentCard.rotate.setValue(0);
```

## 🚀 Ventajas del Nuevo Efecto

### Comparado con Scroll Horizontal

- ✅ **Más elegante:** Efecto 3D vs movimiento plano
- ✅ **Menos espacio:** Stack vertical vs scroll horizontal
- ✅ **Mayor atención:** Animación llamativa
- ✅ **Mejor UX:** Interacción más intuitiva

### Performance

- ✅ **Native Driver:** Animaciones en hilo nativo
- ✅ **Memoria eficiente:** Solo 3 tarjetas visibles
- ✅ **CPU optimizado:** Transformaciones hardware-aceleradas
- ✅ **Sin librerías:** Código nativo puro

## 🎯 Casos de Uso Ideales

### Presentación de Productos

- **Destacar contenido premium**
- **Crear sensación de profundidad**
- **Mantener atención del usuario**

### Storytelling

- **Narración secuencial**
- **Revelación progresiva**
- **Experiencia inmersiva**

### Contenido Featured

- **Promociones especiales**
- **Nuevos lanzamientos**
- **Contenido recomendado**

Este efecto de stack apilado transforma la experiencia del carrusel de un simple scroll horizontal a una presentación visualmente impactante que mantiene la atención del usuario y crea una sensación de profundidad y dinamismo.
