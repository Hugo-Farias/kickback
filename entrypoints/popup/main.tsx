import { render } from "preact";
import { StrictMode } from "preact/compat";
import App from "./App.tsx";
import "./style.css";

if (import.meta.hot) {
  import.meta.hot.on("vite:beforeUpdate", () => console.clear());
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Application cannot be rendered.");
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement,
);
