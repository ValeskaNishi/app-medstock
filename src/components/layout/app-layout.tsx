import { MedicineBoxOutlined, SwapOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/medStock.png";

const { Sider, Content, Header } = Layout;

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/produtos",
      icon: <MedicineBoxOutlined />,
      label: "Produtos",
    },
    {
      key: "/gerenciamento-estoque",
      icon: <SwapOutlined />,
      label: "Estoque",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme="light"
        style={{ background: "#fefefe", borderRight: "1px solid #e8e8e8" }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "2px solid #fae387",
            padding: "0 16px",
          }}
        >
          <img
            src={logo}
            alt="MedStock"
            style={{ height: 56, objectFit: "contain" }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: "#fefefe",
            borderRight: "none",
            marginTop: 8,
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#027f52",
            padding: "0 24px",
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#fae387",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 0.5,
            }}
          >
            Sistema de Controle de Insumos Médicos
          </span>
        </Header>
        <Content
          style={{ padding: 24, background: "#f5f5f5", overflow: "auto" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
