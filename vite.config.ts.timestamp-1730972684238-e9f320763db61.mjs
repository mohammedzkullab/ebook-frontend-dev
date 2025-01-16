// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "file:///C:/ebook-frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/ebook-frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/ebook-frontend/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/ebook-frontend/vite.config.ts";
var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    define: {
      "process.env": env
    },
    server: {
      host: "0.0.0.0",
      port: 3e3
    },
    plugins: [
      vue(),
      vueJsx()
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxlYm9vay1mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcZWJvb2stZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L2Vib29rLWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQge2RlZmluZUNvbmZpZywgbG9hZEVudn0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0ICh7bW9kZX0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksIFwiXCIpO1xyXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgIFwicHJvY2Vzcy5lbnZcIjogZW52LFxyXG4gICAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgIHBvcnQ6IDMwMDBcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlPLFNBQVMsZUFBZSxXQUFXO0FBRTVRLFNBQVEsY0FBYyxlQUFjO0FBQ3BDLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFKMEgsSUFBTSwyQ0FBMkM7QUFNOUwsSUFBTyxzQkFBUSxDQUFDLEVBQUMsS0FBSSxNQUFNO0FBQ3pCLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxTQUFPLGFBQWE7QUFBQSxJQUNsQixRQUFRO0FBQUEsTUFDTixlQUFlO0FBQUEsSUFDakI7QUFBQSxJQUNGLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsTUFDSixPQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFDRDsiLAogICJuYW1lcyI6IFtdCn0K
