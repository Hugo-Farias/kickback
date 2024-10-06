// vite.config.ts
import { defineConfig } from "file:///D:/Users/Hugo/Documents/Projects/BrowserExtensions/kickback-rewrite/node_modules/.pnpm/vite@4.5.3_sass@1.78.0/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Users/Hugo/Documents/Projects/BrowserExtensions/kickback-rewrite/node_modules/.pnpm/@vitejs+plugin-react@4.3.1_vite@4.5.3_sass@1.78.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { crx } from "file:///D:/Users/Hugo/Documents/Projects/BrowserExtensions/kickback-rewrite/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.25/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Kick.com Video/VODS Resumer",
  version: "2.0",
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
  content_scripts: [
    {
      js: ["src/video/videoObserver.ts", "src/video/videoLinks.ts"],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXEh1Z29cXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXEJyb3dzZXJFeHRlbnNpb25zXFxcXGtpY2tiYWNrLXJld3JpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXEh1Z29cXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXEJyb3dzZXJFeHRlbnNpb25zXFxcXGtpY2tiYWNrLXJld3JpdGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL0h1Z28vRG9jdW1lbnRzL1Byb2plY3RzL0Jyb3dzZXJFeHRlbnNpb25zL2tpY2tiYWNrLXJld3JpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCB7IGNyeCB9IGZyb20gXCJAY3J4anMvdml0ZS1wbHVnaW5cIjtcclxuaW1wb3J0IG1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0Lmpzb25cIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIGNyeCh7IG1hbmlmZXN0IH0pXSxcclxufSk7XHJcbiIsICJ7XG4gIFwibWFuaWZlc3RfdmVyc2lvblwiOiAzLFxuICBcIm5hbWVcIjogXCJLaWNrLmNvbSBWaWRlby9WT0RTIFJlc3VtZXJcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMi4wXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJBdXRvbWF0aWNhbGx5IGJvb2ttYXJrIGtpY2suY29tIHZpZGVvcyBzbyB0aGV5IHJlc3VtZSBmcm9tIHdoZXJlIHlvdSBsZWZ0IG9mZlwiLFxuICBcInBlcm1pc3Npb25zXCI6IFtcInRhYnNcIiwgXCJzdG9yYWdlXCJdLFxuICBcImljb25zXCI6IHtcbiAgICBcIjE2XCI6IFwic3JjL2Fzc2V0cy9sb2dvXzE2LnBuZ1wiLFxuICAgIFwiNDhcIjogXCJzcmMvYXNzZXRzL2xvZ29fNDgucG5nXCIsXG4gICAgXCIxMjhcIjogXCJzcmMvYXNzZXRzL2xvZ29fMTI4LnBuZ1wiXG4gIH0sXG4gIFwiYmFja2dyb3VuZFwiOiB7XG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHNcIlxuICB9LFxuICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXG4gICAge1xuICAgICAgXCJqc1wiOiBbXCJzcmMvdmlkZW8vdmlkZW9PYnNlcnZlci50c1wiLCBcInNyYy92aWRlby92aWRlb0xpbmtzLnRzXCJdLFxuICAgICAgXCJtYXRjaGVzXCI6IFtcImh0dHBzOi8vKi5raWNrLmNvbS8qXCJdXG4gICAgfVxuICBdXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlZLFNBQVMsb0JBQW9CO0FBQ3RhLE9BQU8sV0FBVztBQUNsQixTQUFTLFdBQVc7OztBQ0ZwQjtBQUFBLEVBQ0Usa0JBQW9CO0FBQUEsRUFDcEIsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsYUFBZSxDQUFDLFFBQVEsU0FBUztBQUFBLEVBQ2pDLE9BQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxZQUFjO0FBQUEsSUFDWixnQkFBa0I7QUFBQSxFQUNwQjtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakI7QUFBQSxNQUNFLElBQU0sQ0FBQyw4QkFBOEIseUJBQXlCO0FBQUEsTUFDOUQsU0FBVyxDQUFDLHNCQUFzQjtBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUNGOzs7QURkQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSwyQkFBUyxDQUFDLENBQUM7QUFDdEMsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
