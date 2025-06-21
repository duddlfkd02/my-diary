"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MoodStats {
  mood: string;
  count: string;
}

interface MoodChartProps {
  data: MoodStats[];
}

export default function MoodChart({ data }: MoodChartProps) {
  const router = useRouter();

  const moodLabelMap: { [key: string]: string } = {
    happy: "행복함",
    sad: "슬픔",
    angry: "화남",
    tired: "피곤함"
  };

  const moodImageMap: { [key: string]: string } = {
    happy: "/mood/happy.png",
    sad: "/mood/sad.png",
    angry: "/mood/angry.png",
    tired: "/mood/tired.png"
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
    <div className="flex justify-center">
      <div className="mx-auto w-full max-w-md">
        <div className="relative mb-2 w-full bg-blueLight px-4 py-6">
          <button type="button" onClick={() => router.back()} className="absolute left-4 top-1/2 -translate-y-1/2">
            <ArrowLeft width={20} height={20} className="hover:text-blue" />
          </button>

          <h2 className="text-center text-lg font-semibold">이달의 감정 요약</h2>
        </div>

        <section className="mb-6 flex flex-col rounded-lg bg-gray-50 px-6 py-4 text-sm">
          <h2 className="mb-4 text-lg font-semibold">이달의 감정 요약</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <img src={moodImageMap[mostFrequentMood.mood]} alt={mostFrequentMoodLabel} className="h-12 w-12" />
              <span className="text-md font-bold">{mostFrequentMoodLabel}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-redAccent text-lg">
                {totalDays}
              </div>
              <p className="text-center text-sm">기록한 날</p>
            </div>
          </div>
        </section>
        <ResponsiveContainer width="100%" height={300} className="font-koddiFont">
          <BarChart layout="vertical" data={formatData} margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              width={80}
              tick={({ x, y, payload }) => {
                const moodKey = formatData.find((item) => item.label === payload.value)?.mood;
                const imgSrc = moodKey ? moodImageMap[moodKey] : "";
                return (
                  <g transform={`translate(${x},${y})`}>
                    <image href={imgSrc} x={-60} y={-8} width={20} height={20} />
                    <text x={-35} y={5} fill="#333" fontSize={12} textAnchor="start">
                      {payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <Tooltip
              wrapperStyle={{
                backgroundColor: "#fff",
                fontSize: "12px"
              }}
              formatter={(value: number) => [`${value}회`, "감정"]}
            />
            <Bar dataKey="count" barSize={25} radius={[0, 5, 5, 0]}>
              {formatData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorMap[entry.mood]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
