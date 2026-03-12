import api from "../../../services/api/api";
import type { Product, ProductRequestDTO, ProductType } from "../types";

const productUrl = "/produtos";

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data } = await api.get(productUrl);
    return data;
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get(`${productUrl}/${id}`);
    return data;
  },

  async getByType(type: ProductType): Promise<Product[]> {
    const { data } = await api.get(`${productUrl}/categoria/${type}`);
    return data;
  },

  async create(payload: ProductRequestDTO): Promise<Product> {
    const { data } = await api.post(productUrl, payload);
    return data;
  },

  async update(id: number, payload: ProductRequestDTO): Promise<Product> {
    const { data } = await api.put(`${productUrl}/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${productUrl}/${id}`);
  },
};
