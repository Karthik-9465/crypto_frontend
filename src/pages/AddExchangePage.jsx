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
        exchangeName,
        apiKey,
        apiSecret,
        label,
      });

      setSuccess("Exchange added successfully ✅");

      // clear form
      setExchangeName("");
      setApiKey("");
      setApiSecret("");
      setLabel("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add exchange ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Add Exchange</h2>

      {success && <p className="text-green-400 mb-3">{success}</p>}
      {error && <p className="text-red-400 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Exchange Name (Binance)"
          value={exchangeName}
          onChange={(e) => setExchangeName(e.target.value)}
          required
          className="w-full p-3 rounded bg-slate-700"
        />

        <input
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
          className="w-full p-3 rounded bg-slate-700"
        />

        <input
          placeholder="API Secret"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
          required
          className="w-full p-3 rounded bg-slate-700"
        />

        <input
          placeholder="Label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-3 rounded bg-slate-700"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 text-black py-3 rounded font-semibold"
        >
          {loading ? "Adding..." : "Add Exchange"}
        </button>
      </form>
    </div>
  );
}
