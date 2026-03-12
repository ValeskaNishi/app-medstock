import type { MovementType } from "../../types";

export interface MovementTypeTagProps {
  type: MovementType;
}

export interface MovementConfig {
  color: string;
  icon: React.ReactNode;
  label: string;
}
