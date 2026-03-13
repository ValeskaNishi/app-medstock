import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
} from "antd";

import type { ColumnsType, ColumnType } from "antd/es/table";

import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "../../components/ui/page-header/page-header";
import { ProductTypeTag } from "./components/product-type-tag/product-type-tag";
import { ProductFormModal } from "./components/product-form-modal/product-form-modal";
import { useProducts } from "./hooks/use-products";

import {
  productTypeLabels,
  type Product,
  type ProductRequestDTO,
  type ProductType,
} from "./types";

const { confirm } = Modal;

export const ProductsPage = () => {
  const { products, loading, submitting, fetchAll, create, update, remove } =
    useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchText, setSearchText] = useState("");

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + product.stockQuantity, 0),
    [products],
  );

  const lowStock = useMemo(
    () => products.filter((product) => product.stockQuantity < 10).length,
    [products],
  );

  const filteredProducts = useMemo(() => {
    const term = searchText.toLowerCase();

    return products.filter((product) =>
      product.description.toLowerCase().includes(term),
    );
  }, [products, searchText]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (values: ProductRequestDTO) => {
    await (editingProduct ? update(editingProduct.id, values) : create(values));

    handleClose();
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleDelete = (product: Product) => {
    confirm({
      title: "Excluir produto",
      icon: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: (
        <>
          <p>
            Tem certeza que deseja excluir o produto{" "}
            <strong>{product.description}</strong>?
          </p>

          <p style={{ color: "#ff4d4f", marginTop: 8 }}>
            Esta ação é permanente e não poderá ser desfeita.
          </p>
        </>
      ),
      okText: "Sim, excluir",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        const ok = await remove(product.id);
        if (ok) fetchAll();
      },
    });
  };

  const getCategoryFilterProps = (): ColumnType<Product> => ({
    filters: Object.entries(productTypeLabels).map(([value, label]) => ({
      text: label,
      value,
    })),
    onFilter: (value, record) => record.type === value,
  });

  const columns: ColumnsType<Product> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        width: 70,
        sorter: (a: Product, b: Product) => a.id - b.id,
      },

      {
        title: "Produto",
        dataIndex: "nameProduct",
        ellipsis: true,
        sorter: (a: Product, b: Product) =>
          a.description.localeCompare(b.description),
      },

      {
        title: "Categoria",
        dataIndex: "type",
        render: (type: ProductType) => <ProductTypeTag type={type} />,
        sorter: (a: Product, b: Product) => a.type.localeCompare(b.type),
        ...getCategoryFilterProps(),
      },

      {
        title: "Preço do Fornecedor",
        dataIndex: "supplierPrice",
        render: (value: number) => `R$ ${value.toFixed(2)}`,
        sorter: (a: Product, b: Product) => a.supplierPrice - b.supplierPrice,
      },

      {
        title: "Quantidade em Estoque",
        dataIndex: "stockQuantity",
        render: (value: number) => (
          <span
            style={{
              color: value < 10 ? "#ff4d4f" : "#52c41a",
              fontWeight: 600,
            }}
          >
            {value}
          </span>
        ),
        sorter: (a: Product, b: Product) => a.stockQuantity - b.stockQuantity,
      },

      {
        title: "Ações",
        render: (_, record) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />

            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={() => handleDelete(record)}
            />
          </Space>
        ),
      },
    ],
    [handleDelete],
  );

  return (
    <div>
      <PageHeader
        title="Produtos"
        subtitle="Gerencie seus produtos do estoque médico"
      />

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total de produtos"
              value={products.length}
              prefix={<MedicineBoxOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total de unidades em estoque"
              value={totalStock}
              prefix={<ArrowUpOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Alertas de estoque baixo"
              value={lowStock}
              prefix={<ArrowDownOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            gap: 12,
          }}
        >
          <Input
            placeholder="Buscar por nome..."
            prefix={<SearchOutlined style={{ color: "#aaa" }} />}
            allowClear
            style={{ maxWidth: 600 }}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            style={{ background: "#027f52" }}
          >
            Novo Produto
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <ProductFormModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        submitting={submitting}
        initialValues={editingProduct}
      />
    </div>
  );
};
