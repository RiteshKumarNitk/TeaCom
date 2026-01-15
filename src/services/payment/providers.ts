import { PaymentProvider, CreatePaymentParams, PaymentStatus } from "./types";

export class MockPaymentProvider implements PaymentProvider {
    async createOrder(params: CreatePaymentParams) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            providerOrderId: `mock_${Date.now()}`,
            amount: params.amount,
            currency: params.currency,
            metadata: {
                mock: true,
                ...params.customer
            }
        };
    }

    async verifyPayment(verificationData: Record<string, any>): Promise<{ status: PaymentStatus; transactionId: string; }> {
        return {
            status: "completed",
            transactionId: `tx_${Date.now()}`
        };
    }
}
