import { BrandName } from "./brand.interface";
import { CategoryProduct } from "./category.interface";

export interface Product {
    productName: string;
    productDescription: string;
    productCategories: number[];
    productQuantity: number;
    productPrice: number;
    brandId: number;
    categoryIds: number[];
}

export interface ProductResponse{
    productId: number;
    productName: string;
    productDescription: string;
    productQuantity: number;
    productPrice: number;
    brand: BrandName;
    categories: CategoryProduct[];
}

export interface ProductView {
    productId: number;
    productName: string;
    productDescription: string;
    productQuantity: number;
    productPrice: number;
    productCategories: number[];
    brandName: string;
    categoryIds: number[];
    categoryNames: string; 
}