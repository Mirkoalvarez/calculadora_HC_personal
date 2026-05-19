import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CalculatorProvider } from "./context/CalculatorContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CalculatorProvider>
          <App />
        </CalculatorProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
