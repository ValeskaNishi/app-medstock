import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/app-layout";
import { ProductsPage } from "../features/products/products-page";
import { StockMovementsPage } from "../features/stock-movements/stock-movements-page";

export const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/produtos" replace />} />
        <Route path="produtos" element={<ProductsPage />} />
        <Route path="gerenciamento-estoque" element={<StockMovementsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
