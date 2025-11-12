import { View, Text } from "react-native";

export function NotProducts({ texto }: { texto: string }) {
    return (
        <View className="flex h-full items-center justify-center p-4">
            <Text className="text-lg text-center text-wrap">{texto}</Text>
        </View>
    )
}