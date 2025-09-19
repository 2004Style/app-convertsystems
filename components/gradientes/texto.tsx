import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text as RNText, Text as TextType } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText, Mask, Rect } from 'react-native-svg';

export interface GradientTextProps {
    texto?: string;
    fontsize?: number;
    padding?: number;
    clases?: string;
    colors: string[];

}

export default function GradientText({ texto = "ConvertSystems", fontsize = 23, padding = 0, clases, colors }: GradientTextProps) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const textRef = useRef<TextType | null>(null);

    useEffect(() => {
        if (textRef.current) {
            textRef.current.measure(
                (
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                    pageX: number,
                    pageY: number
                ) => {
                    setSize({
                        width: width + padding * 2,
                        height: height + padding * 2,
                    });
                }
            );
        }
    }, [texto]);

    return (
        <View style={styles.container} className={clases}>
            <RNText
                ref={textRef}
                style={{
                    position: 'absolute',
                    fontSize: fontsize,
                    fontWeight: 'bold',
                    opacity: 0,
                }}
            >
                {texto}
            </RNText>

            {size.width > 0 && size.height > 0 && (
                <Svg width={size.width} height={size.height}>
                    <Defs>
                        <LinearGradient id="textGradient" x1="0" y1="0" x2="1" y2="0">
                            {colors.map((color, index) => (
                                <Stop key={index} offset={`${index * (100 / (colors.length - 1))}%`} stopColor={color} />
                            ))}
                        </LinearGradient>

                        <Mask id="textMask">
                            <SvgText
                                x={size.width / 2}
                                y={size.height / 2 + fontsize / 3}
                                fontSize={fontsize}
                                fontWeight="bold"
                                textAnchor="middle"
                                fill="white"
                            >
                                {texto}
                            </SvgText>
                        </Mask>
                    </Defs>

                    <Rect
                        width={size.width}
                        height={size.height}
                        fill="url(#textGradient)"
                        mask="url(#textMask)"
                    />
                </Svg>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//<GradientText colors={["#FF0000", "#00FF00"]}></GradientText>
