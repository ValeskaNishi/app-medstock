import type { ProductType } from "../../types";

export const typeColors: Record<ProductType, string> = {
  MEDICATION: "blue",
  EPI: "green",
  SURGICAL_MATERIAL: "orange",
};

export interface ProductTypeTagProps {
  type: ProductType;
}
