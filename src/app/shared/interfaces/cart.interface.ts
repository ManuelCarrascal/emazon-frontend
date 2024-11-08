import { Brand } from "./brand.interface";
import { Category } from "./category.interface";

export interface CartProduct {
    productId: number;
    productName: string;
    productDescription: string;
    productQuantity: number;
    productPrice: number;
    cartQuantity: number;
    brand: Brand;
    categories: Category[];
    subtotal: number;
  }
  
  export interface CartResponse {
    content: CartProduct[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    ascending: boolean;
    empty: boolean;
    total: number;
  }