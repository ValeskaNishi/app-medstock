import { Typography } from "antd";
import type { PageHeaderProps } from "./interfaces";

const { Title, Text } = Typography;

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <div style={{ marginBottom: 24 }}>
    <Title level={3} style={{ margin: 0, color: "#1a1a2e" }}>
      {title}
    </Title>
    {subtitle && <Text type="secondary">{subtitle}</Text>}
  </div>
);
