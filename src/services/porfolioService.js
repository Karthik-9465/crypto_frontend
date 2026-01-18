import api from "./axiosInstance.js";

// Example: total portfolio summary
export const getPortfolioSummary = async () => {
  const res = await api.get("/api/portfolio/summary");
  return res.data;
};
