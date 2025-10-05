import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, GoalIcon as PaypalIcon, Check, ArrowRight } from "lucide-react-native";
import { ServicioDeCompra } from '@/utils/url-compras';
import { IPagosBody } from '@/interfaces/interfaces';
import { ComprarB_ClientNew } from '@/routes/user.routes';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Icon } from '../ui/icon';

interface paymentsMethodsProps {
    id: string;
    precio: string;
    comprar: "producto" | "suscripcion";
    classNamebtn?: string;
    classNameDialog?: string;
}

export function Payment({ id, precio, classNamebtn = "", comprar, classNameDialog = "" }: paymentsMethodsProps) {
    const { session, status } = useAuth();
    const [selectedPayment, setSelectedPayment] = useState<"paypal" | "mercadopago" | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);

        if (status !== "authenticated" || session === null) {
            setIsProcessing(false);
            return;
        }

        if (selectedPayment === null) {
            alert("Seleccione un método de pago");
            setIsProcessing(false);
            return;
        }

        try {
            if (!id || !precio) {
                throw new Error("El id y el precio son requeridos");
            }

            const body: IPagosBody = {
                service: selectedPayment,
                compra: comprar,
                monto: Number(precio),
                currency: "USD",
                productId: id,
                userId: session?.user.id
            }

            const response = await fetch(`${ComprarB_ClientNew}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Forwarded-Proto": "https",
                    "Authorization": `Bearer ${session?.backendTokens.accessToken}`
                },
                credentials: "include",
                body: JSON.stringify(body),
            });

            const { data } = await response.json();

            if (response.ok) {
                if (!data || typeof data !== "string") {
                    alert("La respuesta no contiene una URL válida");
                    setIsProcessing(false);
                    return;
                }

                // Cierra el diálogo
                setShowPaymentDialog(false);

                await WebBrowser.openBrowserAsync(data, {
                    toolbarColor: '#6366f1',
                    controlsColor: '#ffffff',
                    showTitle: true,
                    enableBarCollapsing: false,
                });

                setIsProcessing(false);
                setSelectedPayment(null);
                return;
            }

            console.log("Error al realizar el pago");
            alert("Error al realizar el pago");
            setIsProcessing(false);

        } catch (error) {
            console.log("Error al realizar el pago", error);
            alert("Error al realizar el pago");
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Button
                className={`w-full bg-orange-600 ${classNamebtn}`}
                onPress={() => setShowPaymentDialog(true)}
            >
                <Text className='text-white font-extrabold'>
                    Realizar pago
                </Text>
            </Button>

            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog} className='bg-background'>
                <DialogContent className={`${classNameDialog}`}>
                    <DialogHeader>
                        <DialogTitle>Completa tu compra</DialogTitle>
                    </DialogHeader>
                    <View className="flex-col gap-6 py-4">
                        <Text className="text-center font-extrabold text-2xl text-foreground">Total: ${precio}</Text>

                        <View className="flex-col gap-4">
                            <Text className="font-medium text-foreground">Seleccione método de pago:</Text>

                            <Button
                                variant={selectedPayment === `${ServicioDeCompra.paypal}` ? 'default' : 'outline'}
                                className="w-full h-20 relative"
                                onPress={() => setSelectedPayment(`${ServicioDeCompra.paypal}`)}
                            >
                                <View className="absolute left-4">
                                    <Icon as={PaypalIcon} className="h-6 w-6 text-blue-600" />
                                </View>
                                <Text className='text-blue-600'>PayPal</Text>
                                {selectedPayment === `${ServicioDeCompra.paypal}` && (
                                    <Icon as={Check} className="h-5 w-5 absolute right-4 text-blue-600" />
                                )}
                            </Button>

                            <Button
                                variant={selectedPayment === `${ServicioDeCompra.mercadopago}` ? 'default' : 'outline'}
                                className="w-full h-20 relative"
                                onPress={() => setSelectedPayment(`${ServicioDeCompra.mercadopago}`)}
                            >
                                <View className="absolute left-4">
                                    <Icon as={CreditCard} className="h-6 w-6 text-blue-600" />
                                </View>
                                <Text className='text-blue-600'>Mercado Pago</Text>
                                {selectedPayment === `${ServicioDeCompra.mercadopago}` && (
                                    <Icon as={Check} className="h-5 w-5 absolute right-4 text-blue-600" />
                                )}
                            </Button>
                        </View>

                        <Button
                            className="w-full bg-green-500"
                            disabled={!selectedPayment || isProcessing}
                            onPress={handlePayment}
                        >
                            {isProcessing ? (
                                <Text>Procesando...</Text>
                            ) : (
                                <>
                                    <Text>Completar Pago</Text>
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </View>
                </DialogContent>
            </Dialog>
        </>
    );
}