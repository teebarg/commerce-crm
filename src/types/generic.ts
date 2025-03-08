import { Category, Order, OrderItem, Product, ProductImage, ProductVariant, Review, User } from "@prisma/client";

export type Pagination = {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

export interface ExtendedProduct extends Product {
    categories: Category[];
    variants: ProductVariant[];
    images: ProductImage[];
}

export interface ExtendedOrder extends Order {
    user: User;
    order_items: OrderItem[];
}

export interface NotificationPreview {
    title: string
    body: string
    icon?: string | null
}

export interface ExtendedUser extends User {
    reviews: Review[];
    orders: Order[];
}
