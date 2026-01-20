import api from "./axiosInstance";

/* ================= SIGN UP ================= */
export const signUp = async (name, email, password) => {
  const res = await api.post(
    "/api/account/auth/public/sign-up",
    null,
    {
      params: { name, email, password },
    }
  );

  const data = res?.data?.data;

  // ✅ Store token if available
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  // ✅ Store user profile (for Settings page)
  localStorage.setItem(
    "user_profile",
    JSON.stringify({
      name: data?.name || name,
      email: data?.email || email,
    })
  );

  return res.data;
};

/* ================= LOGIN ================= */
export const login = async (email, password) => {
  const res = await api.post(
    "/api/account/auth/public/log-in",
    null,
    {
      params: { email, password },
    }
  );

  const data = res?.data?.data;

  // ✅ Store token
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  // ✅ THIS IS THE IMPORTANT FIX 🔥
  localStorage.setItem(
    "user_profile",
    JSON.stringify({
      name: data?.name || data?.username || "",
      email: data?.email || email, // fallback to login email
    })
  );

  return res.data;
};

/* ================= LOGOUT ================= */
export const logout = () => {
  // ✅ Clear all user-related data
  localStorage.removeItem("token");
  localStorage.removeItem("user_profile");
  localStorage.removeItem("address");
};

/* ================= FORGET PASSWORD ================= */
export const forgetPassword = async (email) => {
  const res = await api.post(
    "/api/account/auth/public/forget-password",
    null,
    { params: { email } }
  );

  return res.data;
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (email, newPassword, otp) => {
  const res = await api.patch(
    "/api/account/auth/public/reset-password",
    null,
    { params: { email, newPassword, otp } }
  );

  return res.data;
};

/* ================= AUTH HELPERS ================= */
export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
