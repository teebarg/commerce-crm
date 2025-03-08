import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const orderRouter = createTRPCRouter({
    all: publicProcedure
        .input(
            z.object({
                query: z.string().default(""),
                page: z.number().default(1),
                pageSize: z.number().default(10),
                sort: z.enum(["asc", "desc"]).default("desc"),
            })
        )
        .query(async ({ input, ctx }) => {
            try {
                const skip = (input.page - 1) * input.pageSize;
                const orders = await ctx.db.order.findMany({
                    skip,
                    take: input.pageSize,
                    orderBy: { created_at: input.sort },
                    include: {
                        order_items: true,
                        user: true,
                    },
                });
                const total = await ctx.db.order.count();
                return {
                    orders,
                    total,
                    page: input.page,
                    pageSize: input.pageSize,
                    totalPages: Math.ceil(total / input.pageSize),
                };
            } catch (error) {
                console.error("Error fetching orders:", error);
                throw error;
            }
        }),
    get: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
        try {
            const order = await ctx.db.order.findUnique({
                where: { id: input },
                include: {
                    order_items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                    shipping_address: true,
                    billing_address: true,
                    user: true,
                    payment: true,
                    coupon: true,
                    cart: true,
                },
            });
            if (!order) throw new Error("Order not found");
            return order;
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        }
    }),
    create: protectedProcedure
        .input(
            z.object({
                orderItems: z.array(
                    z.object({
                        variantId: z.number(),
                        quantity: z.number(),
                        price: z.number(),
                    })
                ),
                shippingAddressId: z.number(),
                billingAddressId: z.number(),
                userId: z.number(),
                couponId: z.number().optional(),
                cartId: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const order = await ctx.db.order.create({
                    data: {
                        order_number: `ORD${Date.now()}`, // Generate a unique order number
                        user_id: input.userId,
                        shipping_address_id: input.shippingAddressId,
                        billing_address_id: input.billingAddressId,
                        subtotal: input.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                        tax: 0.0, // Add tax calculation logic if needed
                        total: input.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0), // Add shipping/tax if applicable
                        status: "PENDING",
                        shipping_method: "STANDARD",
                        shipping_fee: 0.0,
                        coupon_id: input.couponId,
                        cart_id: input.cartId,
                        order_items: {
                            create: input.orderItems.map((item) => ({
                                variant_id: item.variantId,
                                quantity: item.quantity,
                                price: item.price,
                            })),
                        },
                    },
                    include: {
                        order_items: true,
                        shipping_address: true,
                        billing_address: true,
                        user: true,
                    },
                });
                return order;
            } catch (error) {
                console.error("Error creating order:", error);
                throw error;
            }
        }),
    update: protectedProcedure
        .input(
            z.object({
                orderId: z.number(),
                data: z.object({
                    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"]),
                    shipping_method: z.enum(["STANDARD", "EXPRESS", "PICKUP"]),
                    payment_status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
                    shipping_fee: z.number(),
                }),
            })
        )
        .mutation(async ({ input, ctx }) => {
            try {
                const updatedOrder = await ctx.db.order.update({
                    where: { id: input.orderId },
                    data: {
                        status: input.data.status,
                        shipping_method: input.data.shipping_method,
                        payment_status: input.data.payment_status,
                        shipping_fee: input.data.shipping_fee,
                    },
                    include: {
                        order_items: true,
                        user: true,
                    },
                });
                return updatedOrder;
            } catch (error) {
                console.error("Error updating order:", error);
                throw error;
            }
        }),
    delete: protectedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
        try {
            // First delete related order_items and payment due to foreign key constraints
            await ctx.db.orderItem.deleteMany({
                where: { order_id: input },
            });
            await ctx.db.payment.deleteMany({
                where: { order_id: input },
            });

            const deletedOrder = await ctx.db.order.delete({
                where: { id: input },
            });
            return deletedOrder;
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error;
        }
    }),
    getByUser: protectedProcedure.input(z.number()).query(async ({ input, ctx }) => {
        try {
            const orders = await ctx.db.order.findMany({
                where: { user_id: input },
                include: {
                    order_items: {
                        include: { variant: true },
                    },
                    shipping_address: true,
                },
            });
            return orders;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }),
    getByStatus: protectedProcedure.input(z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"])).query(async ({ input, ctx }) => {
        try {
            const orders = await ctx.db.order.findMany({
                where: { status: input },
                include: {
                    order_items: true,
                    user: true,
                },
            });
            return orders;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    }),
    generateInvoice: protectedProcedure
        .input(
            z.object({
                orderId: z.number().int().positive(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { orderId } = input;

            // Fetch the order with all necessary relations
            const order = await ctx.db.order.findUnique({
                where: { id: orderId },
                include: {
                    user: true,
                    shipping_address: true,
                    billing_address: true,
                    order_items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                    payment: true,
                    coupon: true,
                },
            });

            if (!order) {
                throw new Error('Order not found');
            }

            // // Ensure the user has permission (e.g., only the order owner or admin can generate the invoice)
            // if (ctx.db.user.fields.role !== Role.ADMIN && ctx.user.id !== order.user_id) {
            //     throw new Error('Unauthorized to generate invoice for this order');
            // }

            // Generate the invoice data
            const invoice = {
                invoiceNumber: `INV-${order.order_number}`,
                date: new Date().toISOString(),
                orderNumber: order.order_number,
                customer: {
                    name: `${order.user.firstName} ${order.user.lastName}`,
                    email: order.user.email,
                    billingAddress: {
                        street: order.billing_address.street,
                        city: order.billing_address.city,
                        state: order.billing_address.state,
                        zip: order.billing_address.zip,
                        country: order.billing_address.country,
                    },
                    shippingAddress: {
                        street: order.shipping_address.street,
                        city: order.shipping_address.city,
                        state: order.shipping_address.state,
                        zip: order.shipping_address.zip,
                        country: order.shipping_address.country,
                    },
                },
                items: order.order_items.map((item) => ({
                    description: `${item.variant.product.name} - ${item.variant.name}`,
                    quantity: item.quantity,
                    unitPrice: Number(item.price),
                    total: Number(item.price) * item.quantity,
                })),
                subtotal: Number(order.subtotal),
                shippingFee: Number(order.shipping_fee),
                tax: Number(order.tax),
                discount: order.coupon
                    ? {
                        code: order.coupon.code,
                        type: order.coupon.discount_type,
                        value: Number(order.coupon.discount_value),
                        applied:
                            order.coupon.discount_type === 'PERCENTAGE'
                                ? Number(order.subtotal) * (Number(order.coupon.discount_value) / 100)
                                : Number(order.coupon.discount_value),
                    }
                    : null,
                total: Number(order.total),
                payment: order.payment
                    ? {
                        method: order.payment.payment_method,
                        amount: Number(order.payment.amount),
                        transactionId: order.payment.transaction_id,
                        date: order.payment.created_at.toISOString(),
                    }
                    : null,
                status: order.status,
            };

            return invoice;
        }),
});
