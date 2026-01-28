import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/definitions.ts", "src/skills.ts"],
  format: ["cjs", "esm"],
  dts: {
    // Skip StockChart from DTS due to lightweight-charts v5 API changes
    resolve: true,
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
    "tailwind-merge",
  ],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
