import api from "./axiosInstance";

// Exchange holdings
export const refreshExchangeHoldings = async () => {
  const res = await api.post(
    "/api/holding/public/refresh-exchange-holdings"
  );
  return res.data; // { message, data }
};

// Manual holdings
export const refreshManualHoldings = async () => {
  const res = await api.get(
    "/api/holding/public/refresh-manual-holdings"
  );
  return res.data;
};

// Manual add / edit
export const manualAddEditHolding = async (payload) => {
  const res = await api.post(
    "/api/holding/public/manual-add-edit",
    payload
  );
  return res.data;
};
