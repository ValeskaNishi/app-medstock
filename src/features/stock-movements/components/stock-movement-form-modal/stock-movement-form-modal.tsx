import { useEffect } from "react";
import { Modal, Form, Select, InputNumber } from "antd";
import type { StockMovementFormModalProps } from "./interfaces";
import { movementTypeLabels } from "../../types";
import {
  currencyFormatter,
  currencyParser,
} from "../../../../utils/formatter/formatter";

export const StockMovementFormModal = ({
  open,
  onClose,
  onSubmit,
  products,
}: StockMovementFormModalProps) => {
  const [form] = Form.useForm();
  const movementType = Form.useWatch("movementType", form);
  const productId = Form.useWatch("productId", form);

  const selectedProduct = products.find((p) => p.id === productId);

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
    onClose();
  };

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      title="Registrar Movimentação de Estoque"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Registrar"
      cancelText="Cancelar"
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="productId"
          label="Produto"
          rules={[{ required: true, message: "Produto é obrigatório" }]}
        >
          <Select
            placeholder="Selecione um produto"
            showSearch
            optionFilterProp="label"
            options={products.map((p) => ({
              value: p.id,
              label: `${p.description} (estoque: ${p.stockQuantity})`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="movementType"
          label="Tipo de Movimentação"
          rules={[{ required: true, message: "Tipo é obrigatório" }]}
        >
          <Select
            placeholder="Selecione o tipo"
            options={Object.entries(movementTypeLabels).map(
              ([value, label]) => ({
                value,
                label,
              }),
            )}
          />
        </Form.Item>

        {selectedProduct && (
          <Form.Item label="Preço do Fornecedor">
            <InputNumber<number>
              prefix="R$"
              value={selectedProduct.supplierPrice}
              precision={2}
              decimalSeparator=","
              formatter={currencyFormatter}
              parser={currencyParser}
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>
        )}

        {movementType === "OUTFLOW" && (
          <Form.Item
            name="salePrice"
            label="Preço de Venda"
            rules={[
              {
                required: true,
                message: "Preço de venda é obrigatório para saída",
              },
            ]}
          >
            <InputNumber<number>
              prefix="R$"
              min={0.01}
              precision={2}
              decimalSeparator=","
              formatter={currencyFormatter}
              parser={currencyParser}
              style={{ width: "100%" }}
              placeholder="0,00"
            />
          </Form.Item>
        )}

        <Form.Item
          name="quantity"
          label="Quantidade"
          rules={[{ required: true, message: "Quantidade é obrigatória" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} placeholder="0" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
