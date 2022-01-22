/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  env: {
    SERVER_URL: "http://localhost:3000",
  },
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  plugins: [["@snowpack/plugin-typescript"]],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
