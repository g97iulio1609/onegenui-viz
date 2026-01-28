// tsup.config.ts
import { defineConfig } from "tsup";
var tsup_config_default = defineConfig({
  entry: ["src/index.ts", "src/definitions.ts", "src/skills.ts"],
  format: ["cjs", "esm"],
  dts: {
    // Skip StockChart from DTS due to lightweight-charts v5 API changes
    resolve: true
  },
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@onegenui/core",
    "@onegenui/react",
    "@onegenui/ui",
    "@onegenui/utils",
    "@onegenui/schemas",
    "zod",
    "lightweight-charts",
    "lucide-react",
    "recharts",
    "clsx",
    "tailwind-merge"
  ],
  esbuildOptions(options) {
    options.jsx = "automatic";
  }
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL2dpdWxpb2xlb25lL1N2aWx1cHBvL2dlblVpL2pzb24tcmVuZGVyL3BhY2thZ2VzL3Zpei90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvVXNlcnMvZ2l1bGlvbGVvbmUvU3ZpbHVwcG8vZ2VuVWkvanNvbi1yZW5kZXIvcGFja2FnZXMvdml6XCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9Vc2Vycy9naXVsaW9sZW9uZS9TdmlsdXBwby9nZW5VaS9qc29uLXJlbmRlci9wYWNrYWdlcy92aXovdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidHN1cFwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBlbnRyeTogW1wic3JjL2luZGV4LnRzXCIsIFwic3JjL2RlZmluaXRpb25zLnRzXCIsIFwic3JjL3NraWxscy50c1wiXSxcbiAgZm9ybWF0OiBbXCJjanNcIiwgXCJlc21cIl0sXG4gIGR0czoge1xuICAgIC8vIFNraXAgU3RvY2tDaGFydCBmcm9tIERUUyBkdWUgdG8gbGlnaHR3ZWlnaHQtY2hhcnRzIHY1IEFQSSBjaGFuZ2VzXG4gICAgcmVzb2x2ZTogdHJ1ZSxcbiAgfSxcbiAgc291cmNlbWFwOiB0cnVlLFxuICBjbGVhbjogdHJ1ZSxcbiAgZXh0ZXJuYWw6IFtcbiAgICBcInJlYWN0XCIsXG4gICAgXCJyZWFjdC1kb21cIixcbiAgICBcIkBvbmVnZW51aS9jb3JlXCIsXG4gICAgXCJAb25lZ2VudWkvcmVhY3RcIixcbiAgICBcIkBvbmVnZW51aS91aVwiLFxuICAgIFwiQG9uZWdlbnVpL3V0aWxzXCIsXG4gICAgXCJAb25lZ2VudWkvc2NoZW1hc1wiLFxuICAgIFwiem9kXCIsXG4gICAgXCJsaWdodHdlaWdodC1jaGFydHNcIixcbiAgICBcImx1Y2lkZS1yZWFjdFwiLFxuICAgIFwicmVjaGFydHNcIixcbiAgICBcImNsc3hcIixcbiAgICBcInRhaWx3aW5kLW1lcmdlXCIsXG4gIF0sXG4gIGVzYnVpbGRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLmpzeCA9IFwiYXV0b21hdGljXCI7XG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsU0FBUyxvQkFBb0I7QUFFelYsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTyxDQUFDLGdCQUFnQixzQkFBc0IsZUFBZTtBQUFBLEVBQzdELFFBQVEsQ0FBQyxPQUFPLEtBQUs7QUFBQSxFQUNyQixLQUFLO0FBQUE7QUFBQSxJQUVILFNBQVM7QUFBQSxFQUNYO0FBQUEsRUFDQSxXQUFXO0FBQUEsRUFDWCxPQUFPO0FBQUEsRUFDUCxVQUFVO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGVBQWUsU0FBUztBQUN0QixZQUFRLE1BQU07QUFBQSxFQUNoQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
