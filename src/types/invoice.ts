// types/invoice.ts
export type Invoice = {
    invoiceNumber: string;
    date: string;
    orderNumber: string;
    customer: {
        name: string;
        email: string | null;
        billingAddress: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        shippingAddress: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
    };
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    subtotal: number;
    shippingFee: number;
    tax: number;
    discount: {
        code: string;
        type: "PERCENTAGE" | "FIXED_AMOUNT";
        value: number;
        applied: number;
    } | null;
    total: number;
    payment: {
        method: "CREDIT_CARD" | "PAYPAL" | "BANK_TRANSFER";
        amount: number;
        transactionId: string;
        date: string;
    } | null;
    status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
};
