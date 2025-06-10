"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle, Cell } from "recharts";

interface MoodStats {
  mood: string;
  count: string;
}

interface MoodChartProps {
  data: MoodStats[];
}

export default function MoodChart({ data }: MoodChartProps) {
  const formatData = data.map((item) => ({
    mood: item.mood,
    count: Number(item.count)
  }));

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-4 text-center font-koddiFontBold">이번 달 나의 감정은?</h2>
      <ResponsiveContainer width="100%" height={300} className="font-koddiFont">
        <BarChart data={formatData}>
          <XAxis dataKey="mood" />
          <YAxis />
          <Tooltip
            wrapperStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "8px",
              fontSize: "12px"
            }}
            formatter={(value: number) => [`${value}회`, "감정"]}
          />
          <Bar dataKey="count" radius={[5, 5, 0, 0]} barSize={30}>
            {formatData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.mood === "happy"
                    ? "#FDE68A"
                    : entry.mood === "sad"
                      ? "#93C5FD"
                      : entry.mood === "angry"
                        ? "#FCA5A5"
                        : entry.mood === "neutral"
                          ? "#D1D5DB"
                          : "#C4B5FD"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
