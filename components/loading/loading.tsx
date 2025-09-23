import { ScrollView, Text, View } from "react-native";

export function Loading() {
    return (
        <ScrollView className="flex-1 h-full">
            <View className="flex-1 h-full  justify-center items-center ">
                <Text>Espere un momento estamos cargando su contenido</Text>
            </View>
        </ScrollView>
    )
}