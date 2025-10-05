import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, LinearGradient, Stop, Rect } from 'react-native-svg';
import { Text } from './ui/text';
import { bg_planesGradient } from '@/utils/bg.clases.planes';

export default function SVGGlareEffect({ clase, plan }: { clase?: string, plan: string }) {
    const translateX = useRef(new Animated.Value(-300)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: 350,
                duration: 4500,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    return (
        <View className={`h-10 overflow-hidden items-center justify-center z-10 ${clase}`}>
            <View style={styles.container}>
                <Svg style={StyleSheet.absoluteFill}>
                    <Defs>
                        <RadialGradient
                            id="backgroundGradient"
                            cx="50%" cy="50%" r="75%"
                        >
                            <Stop offset="0%" stopColor={bg_planesGradient(plan).Color1} stopOpacity="1" />
                            <Stop offset="80%" stopColor={bg_planesGradient(plan).Color2} stopOpacity="1" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#backgroundGradient)" />
                </Svg>

                <View style={styles.card}>
                    <Text className='flex-1 font-bold' style={{ textTransform: 'uppercase', textAlign: 'center', verticalAlign: 'middle', letterSpacing: 2, color: bg_planesGradient(plan).foreground }}>{plan}</Text>
                    <Animated.View
                        style={[
                            styles.glareWrapper,
                            {
                                transform: [
                                    { translateX },
                                    { rotate: '20deg' },
                                ],
                            },
                        ]}
                    >
                        <Svg width="200" height="200%">
                            <Defs>
                                <LinearGradient id="glareGradient" x1="0" y1="0" x2="1" y2="0">
                                    <Stop offset="30%" stopColor="transparent" stopOpacity="0" />
                                    <Stop offset="50%" stopColor="rgba(255,255,255,0.50)" stopOpacity="0.50" />
                                    <Stop offset="70%" stopColor="transparent" stopOpacity="0" />
                                </LinearGradient>
                            </Defs>

                            <Rect
                                x="0"
                                y="0"
                                width="200"
                                height="100%"
                                fill="url(#glareGradient)"
                            />
                        </Svg>
                    </Animated.View>
                </View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        width: 190,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    card: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    glareWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
