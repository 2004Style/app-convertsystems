import { View } from "react-native";
import { CardLoading, skeletonprops } from "./loading-shop";

export function Loading({ descuento, precio }: skeletonprops) {
    const elementos: number[] = [1, 2, 3]
    return (
        <View className="flex flex-row flex-wrap p-2 gap-4 justify-center">
            {
                elementos.map(element => {
                    return <CardLoading key={element} descuento={descuento} precio={precio}></CardLoading>;
                })
            }
        </View >
    );
}