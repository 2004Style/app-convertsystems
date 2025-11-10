import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FolderOpen, LucideIcon, Paperclip } from 'lucide-react-native';
import { Icon } from '../ui/icon';

interface Version {
    item: string;
    icon: LucideIcon;
}

export interface DataCarruselWelcome {
    title_card: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    version: Version[];
}

interface NativeCarouselProps {
    data: DataCarruselWelcome[];
    autoPlayDelay?: number;
}

const GradientBorderCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <View style={{
            borderRadius: 16,
            padding: 2,
            width: '100%',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 8,
        }}>
            <LinearGradient
                colors={['#6ff6f1', '#a8ffff', '#00ff99']}
                style={{
                    borderRadius: 16,
                    padding: 2,
                    width: '100%',
                }}
            >
                <View style={styles.innerCard} className='bg-white/90 dark:bg-gray-900/90'>
                    {children}
                </View>
            </LinearGradient>
        </View>
    );
};

export function NativeCarousel({ data, autoPlayDelay = 3000 }: NativeCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');

    // Animaciones para cada tarjeta
    const cardAnimations = useRef(
        data.map(() => ({
            translateY: new Animated.Value(0),
            scale: new Animated.Value(1),
            opacity: new Animated.Value(1),
            rotate: new Animated.Value(0),
        }))
    ).current;

    // Función para animar la transición a la siguiente tarjeta
    const animateToNext = () => {
        const currentCard = cardAnimations[currentIndex];
        const nextIndex = (currentIndex + 1) % data.length;

        // Animar la tarjeta actual saliendo
        Animated.parallel([
            Animated.timing(currentCard.translateY, {
                toValue: -50,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(currentCard.scale, {
                toValue: 1.1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(currentCard.opacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(currentCard.rotate, {
                toValue: 5,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Resetear la tarjeta que salió
            currentCard.translateY.setValue(0);
            currentCard.scale.setValue(1);
            currentCard.opacity.setValue(1);
            currentCard.rotate.setValue(0);

            // Cambiar al siguiente índice
            setCurrentIndex(nextIndex);

            // Animar las tarjetas del stack para reorganizarse
            animateStackReorganization();
        });
    };

    // Función para reorganizar el stack después de la transición
    const animateStackReorganization = () => {
        cardAnimations.forEach((animation, index) => {
            const relativeIndex = (index - currentIndex + data.length) % data.length;

            if (relativeIndex === 0) {
                // Tarjeta principal (al frente)
                Animated.parallel([
                    Animated.timing(animation.translateY, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation.scale, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else if (relativeIndex <= 1) {
                // Tarjetas en el stack (atrás) - todas del mismo tamaño
                Animated.parallel([
                    Animated.timing(animation.translateY, {
                        toValue: relativeIndex * 8,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animation.scale, {
                        toValue: 1, // Mantener todas las cartas del mismo tamaño
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        });
    };

    // Auto-play effect
    useEffect(() => {
        if (data.length === 0) return;

        const interval = setInterval(() => {
            animateToNext();
        }, autoPlayDelay);

        return () => clearInterval(interval);
    }, [currentIndex, data.length, autoPlayDelay]);

    // Inicializar posiciones del stack
    useEffect(() => {
        animateStackReorganization();
    }, []);

    const renderStackedCard = (item: DataCarruselWelcome, index: number) => {
        const relativeIndex = (index - currentIndex + data.length) % data.length;
        const animation = cardAnimations[index];

        // Solo mostrar las primeras 2 tarjetas del stack
        if (relativeIndex > 1) return null;

        const zIndex = 10 - relativeIndex;

        return (
            <Animated.View
                key={index}
                style={[
                    styles.stackedCard,
                    {
                        zIndex,
                        transform: [
                            { translateY: animation.translateY },
                            { scale: animation.scale },
                            {
                                rotate: animation.rotate.interpolate({
                                    inputRange: [0, 10],
                                    outputRange: ['0deg', '10deg'],
                                }),
                            },
                        ],
                        opacity: animation.opacity,
                    },
                ]}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (relativeIndex === 0) {
                            animateToNext();
                        }
                    }}
                    style={styles.cardTouchable}
                >
                    <GradientBorderCard>
                        <View className='w-full items-center gap-2'>
                            <Text style={styles.title} className='dark:text-white text-black'>
                                {item.title_card}
                            </Text>

                            <View className='w-full'>
                                <View style={styles.row}>
                                    <Icon as={Paperclip} className='dark:text-white text-black' />
                                    <Text style={styles.text} className='dark:text-white text-black'>
                                        {item.nombre}
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Icon as={FolderOpen} className='dark:text-white text-black' />
                                    <Text style={styles.text} className='dark:text-white text-black'>
                                        {item.categoria}
                                    </Text>
                                </View>
                            </View>

                            <Text className='dark:text-white text-black text-center' numberOfLines={3}>
                                {item.descripcion}
                            </Text>

                            <View className='flex-row flex-wrap w-full justify-between'>
                                {item.version.map((version, idx) => (
                                    <View key={idx} style={styles.row}>
                                        <Icon as={version.icon} className='dark:text-white text-black' />
                                        <Text style={styles.text} className='dark:text-white text-black'>
                                            {version.item}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </GradientBorderCard>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (data.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.stackContainer}>
                {data.map((item, index) => renderStackedCard(item, index))}
            </View>

            {/* Indicadores de paginación mejorados */}
            <View style={styles.pagination}>
                {data.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex ? styles.dotActive : styles.dotInactive,
                        ]}
                        onPress={() => {
                            setCurrentIndex(index);
                            setTimeout(() => animateStackReorganization(), 100);
                        }}
                    />
                ))}
            </View>

            {/* Botón para avanzar manualmente */}
            {/* <TouchableOpacity style={styles.nextButton} onPress={animateToNext}>
                <Text style={styles.nextButtonText}>Siguiente</Text>
            </TouchableOpacity> */}
        </View>
    );
} const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    stackContainer: {
        height: 250,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    stackedCard: {
        position: 'absolute',
        width: '90%',
        maxWidth: 350,
    },
    cardTouchable: {
        width: '100%',
    },
    innerCard: {
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 5,
    },
    text: {
        fontSize: 14,
        flexShrink: 1,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 8,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    dotInactive: {
        backgroundColor: '#ccc',
    },
    dotActive: {
        backgroundColor: '#6366f1',
    },
    nextButton: {
        marginTop: 7,
        backgroundColor: '#6366f1',
        paddingHorizontal: 13,
        paddingVertical: 7,
        borderRadius: 5,
    },
    nextButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default NativeCarousel;