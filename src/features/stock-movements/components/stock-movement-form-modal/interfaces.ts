import type { Product } from "../../../products/types";
import type { StockMovementRequestDTO } from "../../types";

export interface StockMovementFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: StockMovementRequestDTO) => Promise<void>;
  products: Product[];
}
