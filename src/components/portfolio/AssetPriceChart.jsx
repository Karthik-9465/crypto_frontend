import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AssetPriceChart({ basePrice }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Initial chart data
    const initial = Array.from({ length: 10 }, (_, i) => ({
      time: `T-${10 - i}`,
      price: basePrice + Math.random() * 5
    }));

    setData(initial);

    // Simulate live updates
    const interval = setInterval(() => {
      setData((prev) => [
        ...prev.slice(1),
        {
          time: new Date().toLocaleTimeString(),
          price:
            prev[prev.length - 1].price +
            (Math.random() - 0.5) * 2
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [basePrice]);

  return (
    <div className="h-[220px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#34d399"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
