export interface SupplyRequest {
    productQuantity: number;
    nextSupplyDate: string;
  }


export interface SupplyResponse{
    productId: number;
    productQuantity: number;
    nextSupplyDate: string;
}