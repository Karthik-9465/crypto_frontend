import api from "./axiosInstance";

export const getPriceSnapshots = (assetSymbol) => {
  return api.get(
    `/api/price-snapshots/public/get-price-snapshots`,
    {
      params: { assetSymbol }
    }
  );
};
