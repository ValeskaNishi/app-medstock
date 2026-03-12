import { useCallback, useState } from "react";
import { message } from "antd";
import type { Product, ProductRequestDTO, ProductType } from "../types";
import { productService } from "../services/product-service";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
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

  const withSubmitting = async <T>(fn: () => Promise<T>) => {
    setSubmitting(true);
    try {
      return await fn();
    } finally {
      setSubmitting(false);
    }
  };

  const fetchAll = useCallback(async () => {
    try {
      const data = await withLoading(() => productService.getAll());
      setProducts(data!);
      return data;
    } catch (err: any) {
      message.error(err?.message || "Erro ao buscar produtos");
    }
  }, []);

  const fetchById = useCallback(async (id: number) => {
    try {
      const data = await withLoading(() => productService.getById(id));
      setProduct(data!);
      return data;
    } catch (err: any) {
      message.error(err?.message || "Produto não encontrado");
    }
  }, []);

  const fetchByType = useCallback(async (type: ProductType) => {
    try {
      const data = await withLoading(() => productService.getByType(type));
      setProducts(data!);
      return data;
    } catch (err: any) {
      message.error(err?.message || "Erro ao buscar produtos por tipo");
    }
  }, []);

  const create = useCallback(async (payload: ProductRequestDTO) => {
    try {
      const data = await withSubmitting(() => productService.create(payload));
      message.success("Produto criado com sucesso!");
      return data;
    } catch (err: any) {
      message.error(err?.message || "Erro ao criar produto");
      throw err;
    }
  }, []);

  const update = useCallback(async (id: number, payload: ProductRequestDTO) => {
    try {
      const data = await withSubmitting(() =>
        productService.update(id, payload),
      );
      message.success("Produto atualizado com sucesso!");
      return data;
    } catch (err: any) {
      message.error(err?.message || "Erro ao atualizar produto");
      throw err;
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      await productService.delete(id);
      message.success("Produto removido com sucesso!");
      return true;
    } catch (err: any) {
      message.error(err?.message || "Erro ao remover produto");
      return false;
    }
  }, []);

  return {
    products,
    product,
    loading,
    submitting,
    fetchAll,
    fetchById,
    fetchByType,
    create,
    update,
    remove,
  };
}
