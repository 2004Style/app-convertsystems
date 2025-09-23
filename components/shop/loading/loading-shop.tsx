import { View } from "react-native";
import { Skeleton } from "../../ui/skeleton";

export interface skeletonprops {
    descuento: boolean,
    precio: boolean
}

export function CardLoading({ descuento, precio }: skeletonprops) {

    return (
        <View className="relative flex flex-col gap-3 p-4 shadow-2xl min-w-[290px] w-[100%] box-border rounded bg-white dark:bg-black">
            {/* apartado de descuento */}
            {descuento &&
                <View className="absolute -top-2 right-2 overflow-hidden" style={{ width: 90, height: 110, zIndex: 10 }} >
                    <Skeleton className=" h-[70%] animate-none" />
                    <Skeleton className="absolute -rotate-[55deg] -z-10 translate-y-0 -translate-x-3 animate-none" style={{ width: 90, height: 90 }} />
                    <Skeleton className="absolute rotate-[55deg] -z-10 translate-y-0 translate-x-3 animate-none" style={{ width: 90, height: 90 }} />
                </View>
            }

            {/* apartado de imagen */}
            <Skeleton
                style={{ height: 224, width: '100%', zIndex: -1 }}
            />

            {/* apartado de etiqueta de plan */}
            <View className={`absolute -top-2 -left-2 overflow-hidden items-center justify-center`}
                style={{ height: 140, width: 140 }}
            >
                <Skeleton className="h-2 w-4 absolute top-0 right-1" />
                <Skeleton className="h-4 w-2 absolute left-0 bottom-1" />
                <Skeleton className="z-10 py-5 w-[200%] -rotate-45 -translate-y-4 -translate-x-4" />
            </View>

            {/* apartado de informacion */}
            <View className="relative flex-col gap-3">
                <Skeleton className="font-extrabold py-4 " />
                <Skeleton className="py-3 w-48" />
                {precio &&
                    <Skeleton className={`py-3 w-24`} />
                }
                {descuento &&
                    <Skeleton className="py-3 w-24" />
                }
                <Skeleton className="py-14" />
                <View className="flex-row gap-2 justify-between">
                    <Skeleton className="p-3 flex-1" />
                    <Skeleton className="p-3 flex-1" />
                    <Skeleton className="p-3 flex-1" />
                </View>

                <Skeleton
                    className=" w-full py-6 rounded-sm"
                />
            </View >
        </View>
    )
}