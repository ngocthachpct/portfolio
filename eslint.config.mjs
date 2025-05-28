import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "public/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    extends: [
      require.resolve("eslint-config-next/core"),
    ],
  },
];

export default eslintConfig;
