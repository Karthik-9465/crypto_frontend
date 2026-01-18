import axiosInstance from "./axiosInstance";

// POST - Refresh Exchange Holdings
export const refreshExchangeHoldings = async () => {
  const response = await axiosInstance.post(
    "/api/holding/public/refresh-exchange-holdings"
  );
  return response.data;
};

// GET - Refresh Manual Holdings
export const refreshManualHoldings = async () => {
  const response = await axiosInstance.get(
    "/api/holding/public/refresh-manual-holdings"
  );
  return response.data;
};
