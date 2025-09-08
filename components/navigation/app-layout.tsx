import { Header } from '@/components/navigation/header';
import { SideMenu } from '@/components/navigation/side-menu';
import { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
    showBackButton?: boolean;
    showMenu?: boolean;
}

export function AppLayout({
    children,
    title,
    showBackButton = false,
    showMenu = true
}: AppLayoutProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [screenData, setScreenData] = useState(Dimensions.get('window'));
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const onChange = (result: { window: any; screen: any }) => {
            setScreenData(result.window);
        };

        const subscription = Dimensions.addEventListener('change', onChange);
        return () => subscription?.remove();
    }, []);

    const handleMenuPress = () => {
        setMenuVisible(true);
    };

    const handleMenuClose = () => {
        setMenuVisible(false);
    };

    return (
        <View
            className="bg-background"
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
                minHeight: screenData.height,
                height: screenData.height
            }}
        >
            <Header
                title={title}
                showBackButton={showBackButton}
                showMenu={showMenu}
                onMenuPress={handleMenuPress}
            />

            <View style={{ flex: 1, minHeight: 0 }}>
                {children}
            </View>

            <SideMenu
                visible={menuVisible}
                onClose={handleMenuClose}
            />
        </View>
    );
}
