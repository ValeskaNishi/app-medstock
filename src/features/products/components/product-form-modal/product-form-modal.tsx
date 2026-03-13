import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import type { ProductFormModalProps } from "./interfaces";
import { productTypeLabels, type ProductRequestDTO } from "../../types";
import {
  currencyFormatter,
  currencyParser,
} from "../../../../utils/formatter/formatter";

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  submitting,
  initialValues,
}) => {
  const [form] = Form.useForm<ProductRequestDTO>();

  const isEditMode = !!initialValues;

  useEffect(() => {
    if (!open) return;
    initialValues ? form.setFieldsValue(initialValues) : form.resetFields();
  }, [open, initialValues]);

  return (
    <Modal
      title={isEditMode ? "Editar Produto" : "Novo Produto"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEditMode ? "Salvar" : "Criar"}
      cancelText="Cancelar"
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="nameProduct"
          label="Nome do Produto"
          rules={[{ required: true, message: "Informe o nome do produto" }]}
        >
          <Input placeholder="Ex: Dipirona 500mg" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Categoria"
          rules={[{ required: true, message: "Selecione a categoria" }]}
        >
          <Select
            placeholder="Selecione o tipo"
            options={Object.entries(productTypeLabels).map(
              ([value, label]) => ({
                value,
                label,
              }),
            )}
          />
        </Form.Item>
        <Form.Item
          name="supplierPrice"
          label="Preço do Fornecedor (custo)"
          rules={[{ required: true, message: "Informe o preço" }]}
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
        <Form.Item
          name="stockQuantity"
          label="Quantidade em Estoque"
          rules={[
            { required: true, message: "Informe a quantidade" },
            { type: "number", min: 0, message: "Mínimo 0" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
