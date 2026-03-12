import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { AppRoutes } from "./routes/app-routes";
import { theme } from "./utils/theme/theme";

function App() {
  return (
    <ConfigProvider theme={theme} locale={ptBR}>
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;
