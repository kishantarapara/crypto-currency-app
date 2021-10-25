import { axiosInstance } from "./axios_instance";

function fetchAssets(payload) {
  return axiosInstance.get("/assets", { params: payload });
}

function fetchAssetById(id) {
  return axiosInstance.get(`/assets/${id}`);
}

function fetchPriceHistory(id, payload) {
  return axiosInstance.get(`/assets/${id}/history`, { params: payload });
}

function fetchCandles(payload) {
  return axiosInstance.get(`/candles`, { params: payload });
}

export { fetchAssets, fetchAssetById, fetchPriceHistory, fetchCandles };
