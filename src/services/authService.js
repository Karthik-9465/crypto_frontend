import axios from "axios";

const API_URL = "http://localhost:8089/api/account/auth/public";

export const login = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/log-in`,
    null,
    {
      params: { email, password }
    }
  );

  const token = response.data.data.token;

  // 🔥 THIS LINE WAS MISSING
  localStorage.setItem("token", token);

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
