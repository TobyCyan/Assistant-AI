import React from "react";
import Modal from "react-modal";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { TokenProvider } from "./components/TokenContext/TokenContext.jsx";

// Set the app element for react-modal
Modal.setAppElement("#root")

ReactDOM.createRoot(document.getElementById("root")).render(
      <TokenProvider>
          <App />
      </TokenProvider>
)
