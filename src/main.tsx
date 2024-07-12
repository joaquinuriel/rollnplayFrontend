import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";
import App from "./app.tsx";
import { fetcher } from "./config.ts";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <SWRConfig value={{ fetcher, onError: console.error }}>
        <App />
      </SWRConfig>
    </NextUIProvider>
  </React.StrictMode>
);
