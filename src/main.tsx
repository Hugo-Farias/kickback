import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Settings from "./Settings.tsx";

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", () => console.clear());
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
);
