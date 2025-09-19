/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { View } from "react-native";

declare global {
    interface Window {
        adsbygoogle?: any[];
    }
}

interface AdBannerProps {
    adSlot: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ adSlot }) => {
    useEffect(() => {
        if (typeof window !== "undefined" && window.adsbygoogle) {
            window.adsbygoogle.push({});
        }
    }, []);

    return (
        <View className="ad-container">
            <View
                className="adsbygoogle"
                style={{ display: "flex" }}
            // data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Reemplaza con tu ID real
            // data-ad-slot={adSlot}
            // data-ad-format="auto"
            // data-full-width-responsive="true"
            />
        </View>
    );
};

export default AdBanner;
