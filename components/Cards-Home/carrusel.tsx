import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import { FolderOpen, LucideIcon, Paperclip } from 'lucide-react-native';
import { Icon } from '../ui/icon';

const { width } = Dimensions.get('window');

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

interface CarouselProps {
    data: DataCarruselWelcome[];
    autoPlayDelay?: number; // tiempo en ms
}

const GradientBorderCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <LinearGradient
            colors={['#6ff6f1', '#a8ffff', '#00ff99']} // Indigo → Purple → Pink
            style={styles.gradientBorder}
            className='md:w-[350] w-full'
        >
            <View style={styles.innerCard} className='bg-white/90 dark:bg-gray-900/90'>
                {children}
            </View>
        </LinearGradient>
    );
};

export function CarouselPlugin({ data, autoPlayDelay = 3000 }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const renderItem = ({ item }: { item: DataCarruselWelcome }) => (
        <View className='items-center justify-center'>
            <GradientBorderCard>
                <View className='w-full items-center gap-2'>

                    <Text style={styles.title} className='dark:text-white text-black'>{item.title_card}</Text>

                    <View className='w-full'>
                        <View style={styles.row}>
                            <Icon as={Paperclip} className='dark:text-white text-black' />
                            <Text style={styles.text} className='dark:text-white text-black'>{item.nombre}</Text>
                        </View>
                        <View style={styles.row}>
                            <Icon as={FolderOpen} className='dark:text-white text-black' />
                            <Text style={styles.text} className='dark:text-white text-black'>{item.categoria}</Text>
                        </View>
                    </View>

                    <Text className='dark:text-white text-black line-clamp-3'>{item.descripcion}</Text>

                    <View className='flex-row flex-wrap w-full justify-between'>
                        {item.version.map((version, idx) => (
                            <View key={idx} style={styles.row}>
                                <Icon as={version.icon} className='dark:text-white text-black' />
                                <Text style={styles.text} className='dark:text-white text-black'>{version.item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </GradientBorderCard>
        </View>
    );

    return (
        <View className='flex-col p-2'>
            <Carousel
                width={width * 0.93}
                height={260}
                data={data}
                renderItem={renderItem}
                scrollAnimationDuration={800}
                autoPlay
                autoPlayInterval={autoPlayDelay}
                loop
                onSnapToItem={(index) => setCurrentIndex(index)}
            />

            {/* Indicadores de paginación */}
            {/* <View style={styles.pagination}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === currentIndex ? styles.dotActive : styles.dotInactive,
                        ]}
                    />
                ))}
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    gradientBorder: {
        borderRadius: 16,
        padding: 2,
        alignSelf: 'center',
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
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    dotInactive: {
        backgroundColor: '#ccc',
    },
    dotActive: {
        backgroundColor: '#6366f1',
    },
});
