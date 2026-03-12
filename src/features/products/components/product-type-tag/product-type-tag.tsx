import { Tag } from "antd";
import { typeColors, type ProductTypeTagProps } from "./interfaces";
import { productTypeLabels } from "../../types";

export const ProductTypeTag = ({ type }: ProductTypeTagProps) => (
  <Tag color={typeColors[type]}>{productTypeLabels[type]}</Tag>
);
