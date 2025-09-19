import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface LinearGradientBackgroundProps {
    clases?: string;
    clasesTexto?: string;
    texto: string;
    colors: string[];
}

export default function LinearGradientBackground({ clases = "", clasesTexto = "", texto = "ConvertSystems", colors = [] }: LinearGradientBackgroundProps) {
    return (
        <View style={styles.container} className={`${clases} items-center justify-center rounded-lg`}>
            <Svg style={StyleSheet.absoluteFill}>
                <Defs>
                    <LinearGradient id="linearBg" x1="0" y1="0" x2="1" y2="0">
                        {colors.map((color, index) => (
                            <Stop key={index} offset={`${index * (100 / (colors.length - 1))}%`} stopColor={color} />
                        ))}
                    </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#linearBg)" />
            </Svg>
            <Text className={`text-nowrap p-2 ${clasesTexto}`}>{texto}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        overflow: 'hidden',
    },
});

{/* <LinearGradientBackground texto='Hola' colors={['#5E261E', '#B93B3D']}></LinearGradientBackground> */ }

