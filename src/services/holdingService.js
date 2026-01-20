import api from "./axiosInstance";

/* ================= EXCHANGE HOLDINGS ================= */
// Page load / manual refresh
export const refreshExchangeHoldings = async () => {
  const res = await api.post(
    "/api/holding/public/refresh-exchange-holdings"
  );
  return res.data; // { message, data }
};

/* ================= MANUAL HOLDINGS ================= */
// Page load / after add-edit-delete
export const refreshManualHoldings = async () => {
  const res = await api.get(
    "/api/holding/public/refresh-manual-holdings"
  );
  return res.data;
};

/* ================= MANUAL ADD / EDIT ================= */
// Used by ManualHoldingDrawer
export const manualAddEditHolding = async (payload) => {
  const res = await api.post(
    "/api/holding/public/manual-add-edit",
    payload
  );
  return res.data;
};

/* ================= MANUAL DELETE ================= */
// 🔥 IMPORTANT (paper requirement)
// Only for MANUAL holdings
export const deleteManualHolding = async (assetSymbol) => {
  const res = await api.delete(
    "/api/holding/public/delete-manual-holding",
    {
      params: { assetSymbol },
    }
  );
  return res.data;
};
