import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./App/App";
import WalletContextProvider from "./context/WalletContextProvider";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <WalletContextProvider>
      <App />
    </WalletContextProvider>
  </AuthContextProvider>
);
