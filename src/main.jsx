import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./App/App";
import WalletContextProvider from "./context/WalletContextProvider";
import AdminContextProvider from "./context/AdminContext";
import { Toaster } from "react-hot-toast";
import  "./Components/toasts.css"
import ModalContextProvider from "./context/modalContext";
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
