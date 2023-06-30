/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  server:
    process.env.NETLIFY || process.env.NETLIFY_LOCAL
      ? "./server.js"
      : undefined,
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  future: {
    // makes the warning go away in v1.15+
    v2_routeConvention: false,
    v2_headers: true,
    v2_meta: true,
    v2_errorBoundary: true,
  },
  serverConditions: ["deno", "worker"],
  serverMainFields: ["main", "module"],
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  serverMinify: false,
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: ".netlify/functions-internal/server.js",
  // publicPath: "/build/",
};
