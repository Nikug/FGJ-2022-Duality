/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  env: {
    //SERVER_URL: "10.0.0.23:3000",
    SERVER_URL: "http://10.0.20:3000",
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
