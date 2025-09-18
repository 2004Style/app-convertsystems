"use client"
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LikesB_Client } from '@/routes/user.routes';
import { useCosultaApi } from "@/hooks/datosApi.hook";
import { useAuth } from "@/contexts/AuthContext";
import { Heart } from 'lucide-react-native';

interface likeProps {
    id: string;
    like: boolean;
    likesCount: number;
}

export function BtnLike({ id, like, likesCount }: likeProps) {
    const { request } = useCosultaApi();
    const { session } = useAuth();
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(likesCount);
    const scaleValue = new Animated.Value(1);

    useEffect(() => {
        setLikeCount(likesCount)
        setIsChecked(like);
    }, [like, likesCount]);

    const toggleLike = async () => {
        if (!session?.user.nombre) {
            return console.log("Usted debe iniciar sesión primero");
        }

        const newStatus = !isChecked;
        setIsChecked(newStatus);

        // Animación de "enlarge" cuando se hace like
        if (newStatus) {
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.2,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                })
            ]).start();
        }

        const { alert, data } = await request(newStatus ? "POST" : "DELETE", `${LikesB_Client}/${id}`);
        if (alert === "success") {
            if (typeof data === 'number') {
                setLikeCount(data);
            } else {
                setLikeCount(data?.data ?? 0);
            }
            return
        }
    };

    return (
        <View style={{
            position: 'relative',
            width: '100%',
            minWidth: 140,
            minHeight: 35,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            overflow: 'hidden'
        }}>
            <TouchableOpacity
                onPress={toggleLike}
                style={{
                    position: 'relative',
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    height: '100%',
                    backgroundColor: 'rgb(202, 0, 0)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4
                }}
            >
                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <Heart
                        size={22.4} // 1.4rem equivalente
                        color="rgb(255, 255, 255)"
                        fill={isChecked ? "rgb(255, 255, 255)" : "transparent"}
                        strokeWidth={3.2} // 0.2rem equivalente
                    />
                </Animated.View>
                <Text style={{
                    color: 'rgb(255, 255, 255)',
                    fontWeight: '600',
                    fontSize: 16
                }}>
                    Likes
                </Text>
            </TouchableOpacity>

            <View style={{
                width: 40,
                paddingVertical: 5,
                paddingHorizontal: 7,
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                position: 'relative'
            }}>
                {/* Triángulo decorativo */}
                <View style={{
                    position: 'absolute',
                    left: -4,
                    width: 8,
                    height: 8,
                    backgroundColor: 'white',
                    transform: [{ rotate: '45deg' }]
                }} />

                <Text style={{
                    color: 'black',
                    fontSize: 16,
                    fontWeight: '600'
                }}>
                    {likeCount.toLocaleString()}
                </Text>
            </View>
        </View>
    );
}
