/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

const nextConfig = {
  removeImports,
  images: {
    remotePatterns: [{ hostname: "i.ibb.co" }],
  },
};

module.exports = nextConfig;
