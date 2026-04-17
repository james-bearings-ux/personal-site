/** @type {import('@ladle/react').UserConfig} */
export default {
  vite: {
    optimizeDeps: {
      // axe-core is CJS-only. Forcing pre-bundling here ensures Vite converts
      // it to ESM correctly and exposes module.exports as the default export.
      include: ["axe-core"],
    },
  },
};
