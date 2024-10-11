
export interface Category{
    categoryName: string;
    categoryDescription: string;
}

export interface CategoryResponse {
    categoryId: number;
    categoryName: string;
    categoryDescription: string;
  }
  
  export interface Pagination<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    isAscending: boolean;
  }

