import axios from "axios";

const API = "http://localhost:8081/api/portfolio";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getHoldings = () =>
  axios.get(`${API}/holdings`, authHeader());

export const addHolding = (data) =>
  axios.post(`${API}/holdings`, data, authHeader());

export const deleteHolding = (id) =>
  axios.delete(`${API}/holdings/${id}`, authHeader());
