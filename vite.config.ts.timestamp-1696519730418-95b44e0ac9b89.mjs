// vite.config.ts
import { defineConfig } from "file:///D:/Users/Hugo/Documents/Projects/kickback/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Users/Hugo/Documents/Projects/kickback/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { crx } from "file:///D:/Users/Hugo/Documents/Projects/kickback/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Kick.com Video/VODS Resumer",
  version: "1.4",
  description: "Automatically bookmark kick.com videos so they resume from where you left off",
  permissions: ["tabs", "storage"],
  icons: {
    "16": "src/assets/logo_16.png",
    "48": "src/assets/logo_48.png",
    "128": "src/assets/logo_128.png"
  },
  background: {
    service_worker: "src/background/background.ts"
  },
  options_page: "index.html",
  content_scripts: [
    {
      js: [
        "src/background/videoObserver.ts",
        "src/background/progressBar.ts"
      ],
      matches: ["https://*.kick.com/*"]
    }
  ]
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest: manifest_default })]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXEh1Z29cXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXGtpY2tiYWNrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxVc2Vyc1xcXFxIdWdvXFxcXERvY3VtZW50c1xcXFxQcm9qZWN0c1xcXFxraWNrYmFja1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovVXNlcnMvSHVnby9Eb2N1bWVudHMvUHJvamVjdHMva2lja2JhY2svdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgY3J4IH0gZnJvbSBcIkBjcnhqcy92aXRlLXBsdWdpblwiO1xuaW1wb3J0IG1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0Lmpzb25cIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBjcngoeyBtYW5pZmVzdCB9KV0sXG59KTtcbiIsICJ7XHJcbiAgXCJtYW5pZmVzdF92ZXJzaW9uXCI6IDMsXHJcbiAgXCJuYW1lXCI6IFwiS2ljay5jb20gVmlkZW8vVk9EUyBSZXN1bWVyXCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMS40XCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkF1dG9tYXRpY2FsbHkgYm9va21hcmsga2ljay5jb20gdmlkZW9zIHNvIHRoZXkgcmVzdW1lIGZyb20gd2hlcmUgeW91IGxlZnQgb2ZmXCIsXHJcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXCJ0YWJzXCIsIFwic3RvcmFnZVwiXSxcclxuICBcImljb25zXCI6IHtcclxuICAgIFwiMTZcIjogXCJzcmMvYXNzZXRzL2xvZ29fMTYucG5nXCIsXHJcbiAgICBcIjQ4XCI6IFwic3JjL2Fzc2V0cy9sb2dvXzQ4LnBuZ1wiLFxyXG4gICAgXCIxMjhcIjogXCJzcmMvYXNzZXRzL2xvZ29fMTI4LnBuZ1wiXHJcbiAgfSxcclxuICBcImJhY2tncm91bmRcIjoge1xyXG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHNcIlxyXG4gIH0sXHJcbiAgXCJvcHRpb25zX3BhZ2VcIjogXCJpbmRleC5odG1sXCIsXHJcbiAgXCJjb250ZW50X3NjcmlwdHNcIjogW1xyXG4gICAge1xyXG4gICAgICBcImpzXCI6IFtcclxuICAgICAgICBcInNyYy9iYWNrZ3JvdW5kL3ZpZGVvT2JzZXJ2ZXIudHNcIixcclxuICAgICAgICBcInNyYy9iYWNrZ3JvdW5kL3Byb2dyZXNzQmFyLnRzXCJcclxuICAgICAgXSxcclxuICAgICAgXCJtYXRjaGVzXCI6IFtcImh0dHBzOi8vKi5raWNrLmNvbS8qXCJdXHJcbiAgICB9XHJcbiAgXVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVQsU0FBUyxvQkFBb0I7QUFDdFYsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsV0FBVzs7O0FDRnBCO0FBQUEsRUFDRSxrQkFBb0I7QUFBQSxFQUNwQixNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixhQUFlLENBQUMsUUFBUSxTQUFTO0FBQUEsRUFDakMsT0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFlBQWM7QUFBQSxJQUNaLGdCQUFrQjtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxjQUFnQjtBQUFBLEVBQ2hCLGlCQUFtQjtBQUFBLElBQ2pCO0FBQUEsTUFDRSxJQUFNO0FBQUEsUUFDSjtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFXLENBQUMsc0JBQXNCO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQ0Y7OztBRGxCQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSwyQkFBUyxDQUFDLENBQUM7QUFDdEMsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
