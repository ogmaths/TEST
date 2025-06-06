import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import "./i18n";
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo Devtools
TempoDevtools.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>,
);
