"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  count: number;
}

interface ActivityChartProps {
  title: string;
  data: DataPoint[];
  color: string;
}

export function ActivityChart({ title, data, color }: ActivityChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
        <p className="text-sm text-slate-400 text-center py-8">No data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={color}
            fill={color}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
