import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store.ts";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { SocketProvider } from "./socket/SocketContext.tsx";
console.log("Socket URL:", import.meta.env.VITE_SOCKET_URL);
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <SocketProvider url={import.meta.env.VITE_SOCKET_URL}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </SocketProvider>
  // </StrictMode>
);
