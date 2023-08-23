import React from "react";
import ReactDOM from "react-dom/client";
import Settings from "./settings/settings";

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", () => console.clear());
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>
);
