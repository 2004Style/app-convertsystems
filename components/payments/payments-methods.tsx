import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, GoalIcon as PaypalIcon, Check, ArrowRight } from "lucide-react-native";
import { ServicioDeCompra } from '@/utils/url-compras';
import { IPagosBody } from '@/interfaces/interfaces';
import { ComprarB_ClientNew } from '@/routes/user.routes';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

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

        if (status !== "authenticated" || session === null) return;

        if (selectedPayment === null) {
            alert("Seleccione un método de pago");
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
                if (!data && typeof data !== "string") {
                    return alert("La respuesta no contiene una URL válida:");
                }
                return router.replace(data);
            }
            console.log("Error al realizar el pago")
            // toast.error("Error al realizar el pago");

        } catch {
            console.log("Error al realizar el pago")
            // toast.error("Error al realizar el pago");
        }

        // despues de la compra, se debe actualizar el estado de la compra
        setIsProcessing(false);
        setSelectedPayment(null);
        setShowPaymentDialog(false);
    };

    return (
        <>
            <Button
                className={`w-full ${classNamebtn}`}
                onPress={() => setShowPaymentDialog(true)}
            >
                <Text className='text-white font-bold'>
                    Realizar pago
                </Text>
            </Button>

            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent className={`${classNameDialog}`}>
                    <DialogHeader>
                        <DialogTitle>Completa tu compra</DialogTitle>
                    </DialogHeader>
                    <View className="space-y-6 py-4">
                        <Text className="text-center font-extrabold text-2xl">Total: ${precio}</Text>

                        <View className="space-y-4">
                            <Text className="font-medium">Seleccione método de pago:</Text>

                            <Button
                                variant={selectedPayment === `${ServicioDeCompra.paypal}` ? 'default' : 'outline'}
                                className="w-full h-20 relative"
                                onPress={() => setSelectedPayment(`${ServicioDeCompra.paypal}`)}
                            >
                                <View className="absolute left-4">
                                    <PaypalIcon className="h-6 w-6" />
                                </View>
                                <Text>PayPal</Text>
                                {selectedPayment === `${ServicioDeCompra.paypal}` && (
                                    <Check className="h-5 w-5 absolute right-4" />
                                )}
                            </Button>

                            <Button
                                variant={selectedPayment === `${ServicioDeCompra.mercadopago}` ? 'default' : 'outline'}
                                className="w-full h-20 relative"
                                onPress={() => setSelectedPayment(`${ServicioDeCompra.mercadopago}`)}
                            >
                                <View className="absolute left-4">
                                    <CreditCard className="h-6 w-6" />
                                </View>
                                <Text>Mercado Pago</Text>
                                {selectedPayment === `${ServicioDeCompra.mercadopago}` && (
                                    <Check className="h-5 w-5 absolute right-4" />
                                )}
                            </Button>
                        </View>

                        <Button
                            className="w-full"
                            disabled={!selectedPayment || isProcessing}
                            onPress={handlePayment}
                        >
                            {isProcessing ? (
                                <Text>Processing...</Text>
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