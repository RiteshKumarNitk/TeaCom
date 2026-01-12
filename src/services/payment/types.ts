export type PaymentStatus = "pending" | "completed" | "failed";

export interface CreatePaymentParams {
    amount: number;
    currency: "INR" | "SAR";
    orderId: string;
    customer: {
        name: string;
        email: string;
        phone?: string;
    };
}

export interface PaymentProvider {
    createOrder(params: CreatePaymentParams): Promise<{
        providerOrderId: string;
        amount: number;
        currency: string;
        metadata: Record<string, any>;
    }>;

    verifyPayment(verificationData: Record<string, any>): Promise<{
        status: PaymentStatus;
        transactionId: string;
    }>;
}

export class PaymentService {
    private provider: PaymentProvider;

    constructor(provider: PaymentProvider) {
        this.provider = provider;
    }

    async createOrder(params: CreatePaymentParams) {
        return this.provider.createOrder(params);
    }

    async verifyPayment(verificationData: Record<string, any>) {
        return this.provider.verifyPayment(verificationData);
    }
}
