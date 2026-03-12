import type { Product, ProductRequestDTO } from "../../types";

export interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductRequestDTO) => Promise<void>;
  submitting: boolean;
  initialValues?: Product | null;
}
