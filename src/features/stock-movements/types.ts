import type { ProductType } from "../products/types";

export type MovementType = "INFLOW" | "OUTFLOW";

export interface StockMovement {
  id: number;
  productId: number;
  productDescription: string;
  movementType: MovementType;
  salePrice: number | null;
  quantity: number;
  date: string;
}

export interface StockMovementRequestDTO {
  productId: number;
  movementType: MovementType;
  salePrice: number;
  quantity: number;
}

export interface StockByTypeDTO {
  description: string;
  type: ProductType;
  availableQuantity: number;
  totalOutflows: number;
}

export interface ProfitDTO {
  description: string;
  type: ProductType;
  totalOutflows: number;
  totalProfit: number;
}

export const movementTypeLabels: Record<MovementType, string> = {
  INFLOW: "Entrada",
  OUTFLOW: "Saída",
};
