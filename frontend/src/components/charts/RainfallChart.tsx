import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { DailyWeatherPoint } from '../../types/index.js';

interface RainfallChartProps {
  timeline: DailyWeatherPoint[];
}

export const RainfallChart: React.FC<RainfallChartProps> = ({ timeline }) => {
  const formattedData = timeline.map((pt, i) => ({
    date: pt.date.slice(5),
    fullDate: pt.date,
    dayIndex: i + 1,
    precipitation: pt.precipitationSum,
    probability: pt.precipitationProbability,
    dataSource: pt.dataSource
  }));

  const totalRain = Math.round(timeline.reduce((acc, p) => acc + p.precipitationSum, 0) * 10) / 10;

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Rainfall Distribution & Precipitation Probability
          </h3>
          <p className="text-xs text-slate-500">
            Estimated total precipitation: <span className="font-semibold text-blue-700">{totalRain} mm</span> across cycle
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
            <span className="text-slate-600">Rainfall (mm)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            <span className="text-slate-600">Precipitation Probability (%)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              interval={Math.max(1, Math.floor(formattedData.length / 10))}
            />
            <YAxis
              yAxisId="left"
              unit="mm"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              unit="%"
              domain={[0, 100]}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1">
                      <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1 flex justify-between">
                        <span>{data.fullDate}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${data.dataSource === 'Forecast' ? 'bg-emerald-800 text-emerald-200' : 'bg-amber-800 text-amber-200'}`}>
                          {data.dataSource}
                        </span>
                      </p>
                      <p className="text-blue-400 font-medium">Daily Rain: {data.precipitation} mm</p>
                      <p className="text-indigo-300">Precipitation Probability: {data.probability}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
              formatter={(value) => <span className="text-slate-600 text-xs font-medium">{value}</span>}
            />
            <Bar
              yAxisId="left"
              dataKey="precipitation"
              name="Rainfall (mm)"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={15}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="probability"
              name="Precipitation Probability (%)"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
