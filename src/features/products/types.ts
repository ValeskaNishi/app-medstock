export type ProductType = "MEDICATION" | "EPI" | "SURGICAL_MATERIAL";

export interface Product {
  id: number;
  description: string;
  type: ProductType;
  supplierPrice: number;
  stockQuantity: number;
}

export interface ProductRequestDTO {
  description: string;
  type: ProductType;
  supplierPrice: number;
  stockQuantity: number;
}

export const productTypeLabels: Record<ProductType, string> = {
  MEDICATION: "Medicamento",
  EPI: "EPI",
  SURGICAL_MATERIAL: "Material Cirúrgico",
};
