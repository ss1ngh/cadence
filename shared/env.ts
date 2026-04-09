export const config = {
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),
  API_PORT: parseInt(process.env.API_PORT || "3000", 10),
  DASHBOARD_PORT: parseInt(process.env.DASHBOARD_PORT || "3001", 10),
};
