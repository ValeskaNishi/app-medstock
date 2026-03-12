import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import type { MovementType } from "../../types";
import type { MovementConfig, MovementTypeTagProps } from "./interfaces";

const movementConfig: Record<MovementType, MovementConfig> = {
  INFLOW: {
    color: "success",
    icon: <ArrowUpOutlined />,
    label: "Entrada",
  },
  OUTFLOW: {
    color: "error",
    icon: <ArrowDownOutlined />,
    label: "Saída",
  },
};

export const MovementTypeTag = ({ type }: MovementTypeTagProps) => {
  const config = movementConfig[type];

  return (
    <Tag color={config.color} icon={config.icon}>
      {config.label}
    </Tag>
  );
};
