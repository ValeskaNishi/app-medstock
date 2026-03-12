import api from "../../../services/api/api";
import type { ProductType } from "../../products/types";
import type {
  ProfitDTO,
  StockByTypeDTO,
  StockMovement,
  StockMovementRequestDTO,
} from "../types";

const stockMovementUrl = "/gerenciamento-estoque";

export const stockMovementService = {
  async getAll(): Promise<StockMovement[]> {
    const { data } = await api.get(stockMovementUrl);
    return data;
  },

  async register(payload: StockMovementRequestDTO): Promise<StockMovement> {
    const { data } = await api.post(stockMovementUrl, payload);
    return data;
  },

  async getStockByType(type: ProductType): Promise<StockByTypeDTO[]> {
    const { data } = await api.get(`${stockMovementUrl}/stock-by-type/${type}`);
    return data;
  },

  async getProfit(): Promise<ProfitDTO[]> {
    const { data } = await api.get(`${stockMovementUrl}/profit`);
    return data;
  },
};
