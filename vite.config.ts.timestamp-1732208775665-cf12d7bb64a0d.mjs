// vite.config.ts
import { vitePlugin as remix } from "file:///C:/Code/Projects/vet_forms/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///C:/Code/Projects/vet_forms/node_modules/vite/dist/node/index.js";
import { flatRoutes } from "file:///C:/Code/Projects/vet_forms/node_modules/remix-flat-routes/dist/index.js";
import tsconfigPaths from "file:///C:/Code/Projects/vet_forms/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  build: {
    target: "ES2022"
  },
  plugins: [
    remix({
      serverModuleFormat: "esm",
      ignoredRouteFiles: ["**/.*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      }
    }),
    tsconfigPaths()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDb2RlXFxcXFByb2plY3RzXFxcXHZldF9mb3Jtc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQ29kZVxcXFxQcm9qZWN0c1xcXFx2ZXRfZm9ybXNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0NvZGUvUHJvamVjdHMvdmV0X2Zvcm1zL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gJ0ByZW1peC1ydW4vZGV2J1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGZsYXRSb3V0ZXMgfSBmcm9tICdyZW1peC1mbGF0LXJvdXRlcydcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnRVMyMDIyJyxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlbWl4KHtcbiAgICAgIHNlcnZlck1vZHVsZUZvcm1hdDogJ2VzbScsXG4gICAgICBpZ25vcmVkUm91dGVGaWxlczogWycqKi8uKiddLFxuICAgICAgcm91dGVzOiBhc3luYyAoZGVmaW5lUm91dGVzKSA9PiB7XG4gICAgICAgIHJldHVybiBmbGF0Um91dGVzKCdyb3V0ZXMnLCBkZWZpbmVSb3V0ZXMpXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdRLFNBQVMsY0FBYyxhQUFhO0FBQzVTLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixvQkFBb0I7QUFBQSxNQUNwQixtQkFBbUIsQ0FBQyxPQUFPO0FBQUEsTUFDM0IsUUFBUSxPQUFPLGlCQUFpQjtBQUM5QixlQUFPLFdBQVcsVUFBVSxZQUFZO0FBQUEsTUFDMUM7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNoQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
