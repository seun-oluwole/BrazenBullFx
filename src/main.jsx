import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./App/App";
import WalletContextProvider from "./context/WalletContextProvider";
import AdminContextProvider from "./context/AdminContext";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <WalletContextProvider>
      <AdminContextProvider>
        <App />
      </AdminContextProvider>
    </WalletContextProvider>
  </AuthContextProvider>
);
