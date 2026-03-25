// https://vite.dev/config/
export default {
  server: {
    proxy: {
      "/api": "https://wellness-tracker-backend-4if1.onrender.com",
    },
  },
};
