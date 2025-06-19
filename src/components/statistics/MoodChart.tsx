"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MoodStats {
  mood: string;
  count: string;
}

interface MoodChartProps {
  data: MoodStats[];
}

export default function MoodChart({ data }: MoodChartProps) {
  const moodLabelMap: { [key: string]: string } = {
    happy: "행복함",
    sad: "슬픔",
    angry: "화남",
    tired: "피곤함"
  };

  const colorMap: { [key: string]: string } = {
    happy: "#FFF494",
    sad: "#8FDAFF",
    angry: "#FF9A9D",
    tired: "#B59FFF"
  };

  const formatData = data.map((item) => ({
    mood: item.mood,
    label: moodLabelMap[item.mood],
    count: Number(item.count)
  }));

  const totalDays = formatData.reduce((sum, item) => sum + item.count, 0);
  const mostFrequentMood = formatData.reduce((prev, current) => (prev.count > current.count ? prev : current), {
    mood: "",
    label: "",
    count: 0
  });
  const mostFrequentMoodLabel = mostFrequentMood.label || "";

  return (
    <div className="w-full max-w-md">
      <section className="mb-6 flex flex-col rounded-lg p-4 text-sm shadow">
        <h2 className="mb-2 text-lg font-semibold">이달의 감정 요약</h2>
        <div className="flex items-center justify-between">
          <p>
            <span className="text-lg font-bold">{mostFrequentMoodLabel}</span>
          </p>

          <p className="flex flex-col items-center text-sm text-gray-500">
            기록한 날 <b>{totalDays}일</b>
          </p>
        </div>
      </section>
      <ResponsiveContainer width="100%" height={300} className="font-koddiFont">
        <BarChart layout="vertical" data={formatData} margin={{ left: 20 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" width={80} tick={{ fontSize: 14 }} />
          <Tooltip
            wrapperStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              padding: "8px",
              fontSize: "12px"
            }}
            formatter={(value: number) => [`${value}회`, "감정"]}
          />
          <Bar dataKey="count" barSize={20} radius={[10, 10, 10, 10]}>
            {formatData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap[entry.mood]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
