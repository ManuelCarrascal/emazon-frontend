import { BrandName } from './brand.interface';
import { CategoryProduct } from './category.interface';

interface BaseProduct {
  productName: string;
  productDescription: string;
  productQuantity: number;
  productPrice: number;
}

export interface Product extends BaseProduct {
  brandId: number;
  categoryIds: number[];
}

export interface ProductResponse extends BaseProduct {
  productId: number;
  brand: BrandName;
  categories: CategoryProduct[];
}

export interface ProductView extends BaseProduct {
  productId: number;
  productCategories: number[];
  brandName: string;
  categoryIds: number[];
  categoryNames: string;
}

export interface ProductQuantity extends Pick<BaseProduct, 'productQuantity'> {}
