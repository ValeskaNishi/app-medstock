import { useState, useCallback } from "react";
import { message } from "antd";
import type {
  ProfitDTO,
  StockByTypeDTO,
  StockMovement,
  StockMovementRequestDTO,
} from "../types";
import { stockMovementService } from "../services/stock-movements-service";
import type { ProductType } from "../../products/types";

export function useStockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [stockByType, setStockByType] = useState<StockByTypeDTO[]>([]);
  const [profit, setProfit] = useState<ProfitDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const withLoading = async <T>(fn: () => Promise<T>) => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = useCallback(async () => {
    try {
      const data = await withLoading(() => stockMovementService.getAll());
      setMovements(data!);
      return data;
    } catch (err: any) {
      message.error(err?.message || "Erro ao buscar movimentações");
    }
  }, []);

  const register = useCallback(async (payload: StockMovementRequestDTO) => {
    setSubmitting(true);
    try {
      const data = await stockMovementService.register(payload);
      message.success("Movimentação registrada com sucesso!");
      return data;
    } catch (err: any) {
      message.error(err?.message || "Erro ao registrar movimentação");
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const fetchStockByType = useCallback(async (type: ProductType) => {
    try {
      const data = await withLoading(() =>
        stockMovementService.getStockByType(type),
      );
      setStockByType(data!);
      return data;
    } catch (err: any) {
      message.error(err?.message || "Erro ao buscar estoque por tipo");
    }
  }, []);

  const fetchProfit = useCallback(async () => {
    try {
      const data = await withLoading(() => stockMovementService.getProfit());
      setProfit(data!);
      return data;
    } catch (err: any) {
      message.error(err?.message || "Erro ao buscar relatório de lucro");
    }
  }, []);

  return {
    movements,
    stockByType,
    profit,
    loading,
    submitting,
    fetchAll,
    register,
    fetchStockByType,
    fetchProfit,
  };
}
