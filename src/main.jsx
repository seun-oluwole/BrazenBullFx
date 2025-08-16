import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "../src/context/AuthContext";
import { Toaster } from "react-hot-toast";
import WalletContextProvider from "../src/context/WalletContextProvider";
import AdminContextProvider from "../src/context/AdminContext";
import ModalContextProvider from "./context/modalContext";
import App from "./App/App";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <WalletContextProvider>
      <AdminContextProvider>
        <ModalContextProvider>
          <App />
          <Toaster 
            containerClassName="toastContainer"
            toastOptions={{
              success: {
                style: {
                  padding: '8px'
                }

              },
              error: {
                style: {
                background: '#ff2323',
                color: '#fff',
                padding: '8px'
              }
              },

          
            }}/>
        </ModalContextProvider>
      </AdminContextProvider>
    </WalletContextProvider>
  </AuthContextProvider>
);
