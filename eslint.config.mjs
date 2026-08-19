import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: ["Next.js-Blog-App-main/**", "node_modules/**", ".next/**"],
  },
];

export default config;
