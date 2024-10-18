// vite.config.ts
import { defineConfig } from "file:///D:/Users/Hugo/Documents/Projects/BrowserExtensions/kickback-rewrite/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Users/Hugo/Documents/Projects/BrowserExtensions/kickback-rewrite/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { crx } from "file:///D:/Users/Hugo/Documents/Projects/BrowserExtensions/kickback-rewrite/node_modules/@crxjs/vite-plugin/dist/index.mjs";

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
  options_page: "index.html",
  content_scripts: [
    {
      js: ["src/video/videoObserver.ts", "src/video/videoLinks.ts"],
      matches: ["https://*.kick.com/*"]
    }
  ]
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest: manifest_default, browser: "chrome" })]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXEh1Z29cXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXEJyb3dzZXJFeHRlbnNpb25zXFxcXGtpY2tiYWNrLXJld3JpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXFVzZXJzXFxcXEh1Z29cXFxcRG9jdW1lbnRzXFxcXFByb2plY3RzXFxcXEJyb3dzZXJFeHRlbnNpb25zXFxcXGtpY2tiYWNrLXJld3JpdGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1VzZXJzL0h1Z28vRG9jdW1lbnRzL1Byb2plY3RzL0Jyb3dzZXJFeHRlbnNpb25zL2tpY2tiYWNrLXJld3JpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmltcG9ydCB7IGNyeCB9IGZyb20gXCJAY3J4anMvdml0ZS1wbHVnaW5cIjtcclxuaW1wb3J0IG1hbmlmZXN0IGZyb20gXCIuL21hbmlmZXN0Lmpzb25cIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCksIGNyeCh7IG1hbmlmZXN0LCBicm93c2VyOiBcImNocm9tZVwiIH0pXSxcclxufSk7XHJcbiIsICJ7XHJcbiAgXCJtYW5pZmVzdF92ZXJzaW9uXCI6IDMsXHJcbiAgXCJuYW1lXCI6IFwiS2ljay5jb20gVmlkZW8vVk9EUyBSZXN1bWVyXCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMi4wXCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkF1dG9tYXRpY2FsbHkgYm9va21hcmsga2ljay5jb20gdmlkZW9zIHNvIHRoZXkgcmVzdW1lIGZyb20gd2hlcmUgeW91IGxlZnQgb2ZmXCIsXHJcbiAgXCJwZXJtaXNzaW9uc1wiOiBbXCJ0YWJzXCIsIFwic3RvcmFnZVwiXSxcclxuICBcImljb25zXCI6IHtcclxuICAgIFwiMTZcIjogXCJzcmMvYXNzZXRzL2xvZ29fMTYucG5nXCIsXHJcbiAgICBcIjQ4XCI6IFwic3JjL2Fzc2V0cy9sb2dvXzQ4LnBuZ1wiLFxyXG4gICAgXCIxMjhcIjogXCJzcmMvYXNzZXRzL2xvZ29fMTI4LnBuZ1wiXHJcbiAgfSxcclxuICBcImJhY2tncm91bmRcIjoge1xyXG4gICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcInNyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHNcIlxyXG4gIH0sXHJcbiAgXCJvcHRpb25zX3BhZ2VcIjogXCJpbmRleC5odG1sXCIsXHJcbiAgXCJjb250ZW50X3NjcmlwdHNcIjogW1xyXG4gICAge1xyXG4gICAgICBcImpzXCI6IFtcInNyYy92aWRlby92aWRlb09ic2VydmVyLnRzXCIsIFwic3JjL3ZpZGVvL3ZpZGVvTGlua3MudHNcIl0sXHJcbiAgICAgIFwibWF0Y2hlc1wiOiBbXCJodHRwczovLyoua2ljay5jb20vKlwiXVxyXG4gICAgfVxyXG4gIF1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlZLFNBQVMsb0JBQW9CO0FBQ3RhLE9BQU8sV0FBVztBQUNsQixTQUFTLFdBQVc7OztBQ0ZwQjtBQUFBLEVBQ0Usa0JBQW9CO0FBQUEsRUFDcEIsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsYUFBZSxDQUFDLFFBQVEsU0FBUztBQUFBLEVBQ2pDLE9BQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxZQUFjO0FBQUEsSUFDWixnQkFBa0I7QUFBQSxFQUNwQjtBQUFBLEVBQ0EsY0FBZ0I7QUFBQSxFQUNoQixpQkFBbUI7QUFBQSxJQUNqQjtBQUFBLE1BQ0UsSUFBTSxDQUFDLDhCQUE4Qix5QkFBeUI7QUFBQSxNQUM5RCxTQUFXLENBQUMsc0JBQXNCO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQ0Y7OztBRGZBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLDRCQUFVLFNBQVMsU0FBUyxDQUFDLENBQUM7QUFDekQsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
