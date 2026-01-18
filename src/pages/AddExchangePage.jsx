import { useState } from "react";
import { addExchange } from "../services/apiKeyService";

export default function AddExchangePage() {
  const [exchangeName, setExchangeName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [label, setLabel] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    try {
      await addExchange({
        exchangeName: exchangeName.trim(),
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
        label: label.trim(),
      });

      setSuccess("Exchange added successfully ✅");

      // clear form
      setExchangeName("");
      setApiKey("");
      setApiSecret("");
      setLabel("");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Exchange already exists ❌");
      } else {
        setError(
          err.response?.data?.message || "Failed to add exchange ❌"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-white mb-1">
        Add Exchange
      </h2>
      <p className="text-slate-400 mb-6">
        Connect your exchange using API keys
      </p>

      {/* Success Message */}
      {success && (
        <p className="text-green-400 mb-4 font-medium">
          {success}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-400 mb-4 font-medium">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        autoComplete="off"
      >
        {/* Exchange Name */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            Exchange Name
          </label>
          <input
            type="text"
            name="exchange_name"
            autoComplete="off"
            placeholder="Binance"
            value={exchangeName}
            onChange={(e) => setExchangeName(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 text-white outline-none"
          />
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            API Key
          </label>
          <input
            type="text"
            name="api_key"
            autoComplete="new-password"
            placeholder="Enter API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 text-white outline-none"
          />
        </div>

        {/* API Secret */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            API Secret
          </label>
          <input
            type="password"
            name="api_secret"
            autoComplete="new-password"
            placeholder="Enter API secret"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            required
            className="w-full p-3 rounded bg-slate-700 text-white outline-none"
          />
        </div>

        {/* Label */}
        <div>
          <label className="block text-sm text-slate-300 mb-1">
            Label (optional)
          </label>
          <input
            type="text"
            name="label"
            autoComplete="off"
            placeholder="My Binance Account"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-3 rounded bg-slate-700 text-white outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded font-semibold text-black transition
            ${
              loading
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600"
            }
          `}
        >
          {loading ? "Adding..." : "Add Exchange"}
        </button>
      </form>
    </div>
  );
}
