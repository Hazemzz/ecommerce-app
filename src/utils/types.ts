export type Image = {
    url: string;
};

export type Category = {
    _id: string;
    name: string;
    slug: string;
    image?: string;
};

export type Brand = {
    _id: string;
    name: string;
    slug: string;
    image?: string;
};

export type Product = {
    _id: string;
    title: string;
    description: string;
    price: number;
    priceAfterDiscount?: number;
    imageCover: string;
    images?: Image[];
    category?: Category;
    brand?: Brand;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    quantity?: number;
    slug?: string;
};

export type CartItem = {
    _id: string;
    product: Product;
    count: number;
    price: number;
};

export type Cart = {
    _id: string;
    totalCartPrice: number;
    numOfCartItems: number;
    cartOwner: string;
    products: CartItem[];
};

export type Address = {
    _id: string;
    name: string;
    details: string;
    city: string;
    phone: string;
    postalCode?: string;
};

export type Order = {
    _id: string;
    totalOrderPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    cartItems: CartItem[];
    createdAt: string;
    paymentMethodType: "cash" | "card";
    shippingAddress?: Address;
};
