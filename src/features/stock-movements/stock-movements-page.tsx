import {
  FallOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  RiseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Statistic,
  Table,
  Tabs,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { PageHeader } from "../../components/ui/page-header/page-header";
import { ProductTypeTag } from "../products/components/product-type-tag/product-type-tag";
import { useProducts } from "../products/hooks/use-products";
import { productTypeLabels, type ProductType } from "../products/types";
import { MovementTypeTag } from "./components/movement-type-tag/movement-type-tag";
import { StockMovementFormModal } from "./components/stock-movement-form-modal/stock-movement-form-modal";
import { useStockMovements } from "./hooks/use-stock-movements";
import type { ProfitDTO, StockByTypeDTO, StockMovement } from "./types";

const categoryOptions = [
  { value: "ALL", label: "Todas as categorias" },
  ...Object.entries(productTypeLabels).map(([value, label]) => ({
    value,
    label,
  })),
];

const TabLabel = ({ label, tooltip }: { label: string; tooltip: string }) => (
  <Tooltip title={tooltip} placement="bottom">
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {label}
      <InfoCircleOutlined style={{ fontSize: 12, color: "#aaa" }} />
    </span>
  </Tooltip>
);

const MovementsTab = () => {
  const { movements, loading, register, fetchAll } = useStockMovements();
  const { products, fetchAll: fetchProducts } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductType | "ALL">(
    "ALL",
  );

  const totalInflow = movements
    .filter((m) => m.movementType === "INFLOW")
    .reduce((s, m) => s + m.quantity, 0);

  const totalOutflow = movements
    .filter((m) => m.movementType === "OUTFLOW")
    .reduce((s, m) => s + m.quantity, 0);

  const filteredMovements = movements.filter((m) => {
    const matchesText = m.productDescription
      .toLowerCase()
      .includes(searchText.toLowerCase());

    if (selectedCategory === "ALL") return matchesText;

    const product = products.find((p) => p.id === m.productId);
    return matchesText && product?.type === selectedCategory;
  });

  useEffect(() => {
    fetchAll();
    fetchProducts();
  }, []);

  const columns: ColumnsType<StockMovement> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Produto",
      dataIndex: "productDescription",
      ellipsis: true,
      sorter: (a, b) =>
        a.productDescription.localeCompare(b.productDescription),
    },
    {
      title: "Categoria",
      key: "category",
      render: (_, record) => {
        const product = products.find((p) => p.id === record.productId);
        return product ? <ProductTypeTag type={product.type} /> : "-";
      },
    },
    {
      title: "Tipo",
      dataIndex: "movementType",
      render: (movementType) => <MovementTypeTag type={movementType} />,
      sorter: (a, b) => a.movementType.localeCompare(b.movementType),
      filters: [
        { text: "Entrada", value: "INFLOW" },
        { text: "Saída", value: "OUTFLOW" },
      ],
      onFilter: (value, record) => record.movementType === value,
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Preço de Venda",
      dataIndex: "salePrice",
      render: (salePrice: number | null) =>
        salePrice ? `R$ ${salePrice.toFixed(2)}` : "-",
      sorter: (a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0),
    },
    {
      title: "Preço do Fornecedor",
      key: "supplierPrice",
      render: (_, record) => {
        const product = products.find((p) => p.id === record.productId);
        return product ? `R$ ${product.supplierPrice.toFixed(2)}` : "-";
      },
      sorter: (a: StockMovement, b: StockMovement) => {
        const priceA =
          products.find((p) => p.id === a.productId)?.supplierPrice ?? 0;
        const priceB =
          products.find((p) => p.id === b.productId)?.supplierPrice ?? 0;
        return priceA - priceB;
      },
    },
    {
      title: "Data",
      dataIndex: "date",
      render: (date: string) => new Date(date).toLocaleDateString("pt-BR"),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: "descend",
    },
  ];

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total de Movimentações"
              value={movements.length}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total de Entradas"
              value={totalInflow}
              prefix={<RiseOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total de Saídas"
              value={totalOutflow}
              prefix={<FallOutlined style={{ color: "#ff4d4f" }} />}
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
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap" }}>
            <Input
              placeholder="Buscar por produto..."
              prefix={<SearchOutlined style={{ color: "#aaa" }} />}
              allowClear
              style={{ maxWidth: 500 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 180 }}
              options={categoryOptions}
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            style={{ background: "#027f52" }}
          >
            Registrar Movimentação
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredMovements}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <StockMovementFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (values) => {
          await register(values);
          fetchAll();
          fetchProducts();
        }}
        products={products}
      />
    </>
  );
};

const ProfitTab = () => {
  const { profit, loading, fetchProfit } = useStockMovements();
  const [searchText, setSearchText] = useState("");
  const totalProfit = profit.reduce((s, p) => s + p.totalProfit, 0);
  const filteredProfit = profit.filter((p) =>
    p.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  useEffect(() => {
    fetchProfit();
  }, []);

  const columns: ColumnsType<ProfitDTO> = [
    {
      title: "Produto",
      dataIndex: "description",
      ellipsis: true,
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Categoria",
      dataIndex: "type",
      render: (type: ProductType) => <ProductTypeTag type={type} />,
      filters: Object.entries(productTypeLabels).map(([value, label]) => ({
        text: label,
        value,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Total de Saídas",
      dataIndex: "totalOutflows",
      sorter: (a, b) => a.totalOutflows - b.totalOutflows,
      render: (totalOutflows: number) => (
        <span style={{ color: "#ff4d4f", fontWeight: 600 }}>
          {totalOutflows}
        </span>
      ),
    },
    {
      title: "Lucro Total (venda − fornecedor)",
      dataIndex: "totalProfit",
      sorter: (a, b) => a.totalProfit - b.totalProfit,
      defaultSortOrder: "descend",
      render: (totalProfit: number) => (
        <span
          style={{
            color: totalProfit >= 0 ? "#52c41a" : "#ff4d4f",
            fontWeight: 600,
          }}
        >
          R$ {totalProfit.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <>
      <Card style={{ marginBottom: 24 }}>
        <Statistic
          title="Lucro Total"
          value={totalProfit}
          precision={2}
          decimalSeparator=","
          groupSeparator="."
          prefix="R$"
          valueStyle={{ color: totalProfit >= 0 ? "#52c41a" : "#ff4d4f" }}
        />
      </Card>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Buscar por produto..."
            prefix={<SearchOutlined style={{ color: "#aaa" }} />}
            allowClear
            style={{ maxWidth: 500 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredProfit}
          rowKey="description"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </>
  );
};

const StockByTypeTab = () => {
  const [selectedType, setSelectedType] = useState<ProductType | "ALL">("ALL");
  const [searchText, setSearchText] = useState("");
  const [allStock, setAllStock] = useState<StockByTypeDTO[]>([]);
  const { stockByType, loading, fetchStockByType } = useStockMovements();

  const sourceData = selectedType === "ALL" ? allStock : stockByType;

  const filteredStock = sourceData.filter((s) =>
    s.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  useEffect(() => {
    if (selectedType === "ALL") {
      Promise.all(
        (Object.keys(productTypeLabels) as ProductType[]).map((type) =>
          fetchStockByType(type),
        ),
      ).then((results) => {
        setAllStock(results.flat().filter(Boolean) as StockByTypeDTO[]);
      });
    } else {
      fetchStockByType(selectedType);
      setAllStock([]);
    }
  }, [selectedType]);

  const columns: ColumnsType<StockByTypeDTO> = [
    {
      title: "Produto",
      dataIndex: "description",
      ellipsis: true,
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Categoria",
      dataIndex: "type",
      render: (type: ProductType) => <ProductTypeTag type={type} />,
    },
    {
      title: "Disponível",
      dataIndex: "availableQuantity",
      sorter: (a, b) => a.availableQuantity - b.availableQuantity,
      render: (availableQuantity: number) => (
        <span
          style={{
            color:
              availableQuantity === 0
                ? "#ff4d4f"
                : availableQuantity < 10
                  ? "#faad14"
                  : "#52c41a",
            fontWeight: 600,
          }}
        >
          {availableQuantity}
        </span>
      ),
    },
    {
      title: "Total de Saídas",
      dataIndex: "totalOutflows",
      sorter: (a, b) => a.totalOutflows - b.totalOutflows,
      render: (totalOutflows: number) => (
        <span style={{ color: "#ff4d4f", fontWeight: 600 }}>
          {totalOutflows}
        </span>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Input
          placeholder="Buscar por produto..."
          prefix={<SearchOutlined style={{ color: "#aaa" }} />}
          allowClear
          style={{ maxWidth: 500 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          value={selectedType}
          onChange={(v) => {
            setSelectedType(v);
            setSearchText("");
          }}
          style={{ width: 200 }}
          options={categoryOptions}
        />
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={filteredStock}
          rowKey="description"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </>
  );
};

export const StockMovementsPage = () => (
  <div>
    <PageHeader
      title="Gerenciamento de Estoque"
      subtitle="Acompanhe entradas, saídas e relatórios"
    />
    <Tabs
      defaultActiveKey="movements"
      items={[
        {
          key: "movements",
          label: (
            <TabLabel
              label="Movimentações"
              tooltip="Histórico de todas as entradas e saídas de produtos no estoque. Filtre por categoria ou tipo de movimentação."
            />
          ),
          children: <MovementsTab />,
        },
        {
          key: "profit",
          label: (
            <TabLabel
              label="Relatório de Lucro"
              tooltip="Lucro por produto calculado como: (preço de venda − preço do fornecedor) × quantidade de saídas."
            />
          ),
          children: <ProfitTab />,
        },
        {
          key: "stock-by-type",
          label: (
            <TabLabel
              label="Estoque por Categoria"
              tooltip="Consulte a quantidade disponível e total de saídas de produtos filtrando por categoria (Medicamento, EPI ou Material Cirúrgico)."
            />
          ),
          children: <StockByTypeTab />,
        },
      ]}
    />
  </div>
);
