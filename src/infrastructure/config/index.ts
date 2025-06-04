export default {
  apiVersion: 1,
  corsConfig: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};
