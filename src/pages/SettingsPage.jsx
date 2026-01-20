import { useEffect, useState } from "react";

const USER_KEY = "user_profile";   // 🔒 read-only (login controls this)
const ADDRESS_KEY = "address";     // 🏠 optional, frontend-only

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [address, setAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    // 🔹 Load user profile (DO NOT MODIFY THIS DATA)
    const userRaw = localStorage.getItem(USER_KEY);
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setName(user.name || "");
        setEmail(user.email || "");
      } catch (e) {
        console.error("Invalid user_profile data");
      }
    }

    // 🔹 Load optional address
    const savedAddress = localStorage.getItem(ADDRESS_KEY);
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  /* ================= SAVE ADDRESS ONLY ================= */
  const saveAddress = () => {
    localStorage.setItem(ADDRESS_KEY, address);
    setEditingAddress(false);
    alert("Address saved successfully");
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* ================= USERNAME ================= */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Username</label>
        <input
          value={name}
          disabled
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
        />
      </div>

      {/* ================= EMAIL ================= */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Email</label>
        <input
          value={email}
          disabled
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
        />
      </div>

      <hr className="border-slate-700 my-4" />

      {/* ================= ADDRESS (OPTIONAL) ================= */}
      <div className="space-y-2">
        <label className="text-sm text-slate-400">
          Address <span className="text-slate-500">(optional)</span>
        </label>

        {!editingAddress && (
          <>
            {address ? (
              <p className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm">
                {address}
              </p>
            ) : (
              <p className="text-slate-500 text-sm">
                No address added (optional)
              </p>
            )}

            <button
              onClick={() => setEditingAddress(true)}
              className="mt-2 text-blue-400 hover:underline text-sm"
            >
              {address ? "Edit Address" : "Add Address"}
            </button>
          </>
        )}

        {editingAddress && (
          <>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Enter your address"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            />

            <div className="flex gap-3 mt-2">
              <button
                onClick={saveAddress}
                className="bg-emerald-500 px-4 py-2 rounded text-black font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setEditingAddress(false)}
                className="bg-slate-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
