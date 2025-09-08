import { SignInForm } from '@/components/sign-in-form';
import { AppLayout } from '@/components/navigation/app-layout';
import { Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

export default function SignInScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AppLayout title="Iniciar Sesión" showBackButton={true} showMenu={false}>
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerClassName="flex-grow justify-center p-4 py-8"
                        keyboardDismissMode="interactive"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="w-full max-w-sm mx-auto">
                            <SignInForm />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </AppLayout>
        </>
    );
}