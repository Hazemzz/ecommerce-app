import { apiClient } from "@/lib/api-client";
import { Brand, Category, Product } from "@/utils/types";

export type Paginated<T> = {
    results: number;
    metadata?: {
        currentPage?: number;
        numberOfPages?: number;
    };
    data: T[];
};

export async function getProducts(params?: Record<string, string | number | undefined>) {
    const { data } = await apiClient.get<Paginated<Product>>("/products", { params });
    return data;
}

export async function getProduct(productId: string) {
    const { data } = await apiClient.get<{ data: Product }>(`/products/${productId}`);
    return data.data;
}

export async function getBrands(params?: Record<string, string | number | undefined>) {
    const { data } = await apiClient.get<Paginated<Brand>>("/brands", { params });
    return data;
}

export async function getBrand(brandId: string) {
    const { data } = await apiClient.get<{ data: Brand }>(`/brands/${brandId}`);
    return data.data;
}

export async function getCategories(params?: Record<string, string | number | undefined>) {
    const { data } = await apiClient.get<Paginated<Category>>("/categories", { params });
    return data;
}

export async function getCategory(categoryId: string) {
    const { data } = await apiClient.get<{ data: Category }>(`/categories/${categoryId}`);
    return data.data;
}
