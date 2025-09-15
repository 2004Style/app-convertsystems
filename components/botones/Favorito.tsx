"use client"
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LikesB_Client } from '@/routes/user.routes';
import { useCosultaApi } from '@/hooks/datosApi.hook';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark } from 'lucide-react-native';

interface likeProps {
    id: string;
}
export default function BtnFavorito({ id }: likeProps) {
    const { request } = useCosultaApi();
    const { session } = useAuth();
    const [isChecked, setIsChecked] = useState<boolean>(true);

    const toggleLike = async () => {
        if (!session?.user.nombre) {
            return console.log("Usted debe iniciar sesión primero");
        }

        const newStatus = !isChecked;
        setIsChecked(newStatus);
        const { alert } = await request(newStatus ? "POST" : "DELETE", `${LikesB_Client}/${id}`);
        if (alert === "success") {
            return
        }
    };

    return (
        <TouchableOpacity className="ui-bookmark" onPress={toggleLike}>
            <View className="bookmark">
                <Bookmark
                    size={24}
                    color={isChecked ? "#007AFF" : "#8E8E93"}
                    fill={isChecked ? "#007AFF" : "transparent"}
                />
            </View>
        </TouchableOpacity>
    );
}
