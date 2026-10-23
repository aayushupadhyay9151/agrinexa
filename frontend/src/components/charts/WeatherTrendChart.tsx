import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceArea
} from 'recharts';
import { DailyWeatherPoint } from '../../types/index.js';

interface WeatherTrendChartProps {
  timeline: DailyWeatherPoint[];
  idealTempMin?: number;
  idealTempMax?: number;
}

export const WeatherTrendChart: React.FC<WeatherTrendChartProps> = ({
  timeline,
  idealTempMin = 18,
  idealTempMax = 26
}) => {
  // Sample or format timeline points for smooth chart rendering
  const formattedData = timeline.map((pt, i) => ({
    date: pt.date.slice(5), // MM-DD
    fullDate: pt.date,
    dayIndex: i + 1,
    minTemp: pt.minTemp,
    maxTemp: pt.maxTemp,
    meanTemp: pt.meanTemp,
    humidity: pt.humidity,
    dataSource: pt.dataSource
  }));

  // Identify where forecast switches to seasonal outlook
  const forecastCount = timeline.filter((p) => p.dataSource === 'Forecast').length;

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Temperature Trajectory & Thermal Comfort
          </h3>
          <p className="text-xs text-slate-500">
            Daily Min / Mean / Max thermal curves versus crop ideal comfort window ({idealTempMin}°C – {idealTempMax}°C)
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
            <span className="text-slate-600">Live Forecast (Days 1–{forecastCount || 14})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span className="text-slate-600">Historical Climate Baseline (ERA5)</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              interval={Math.max(1, Math.floor(formattedData.length / 10))}
            />
            <YAxis
              unit="°C"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11 }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-1">
                      <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1 flex justify-between">
                        <span>{data.fullDate} (Day {data.dayIndex})</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${data.dataSource === 'Forecast' ? 'bg-emerald-800 text-emerald-200' : 'bg-amber-800 text-amber-200'}`}>
                          {data.dataSource}
                        </span>
                      </p>
                      <p className="text-emerald-400 font-medium">Mean: {data.meanTemp}°C</p>
                      <p className="text-slate-300">Min: {data.minTemp}°C | Max: {data.maxTemp}°C</p>
                      <p className="text-slate-400">Relative Humidity: {data.humidity}%</p>
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

            {/* Ideal temperature range band */}
            <ReferenceArea
              y1={idealTempMin}
              y2={idealTempMax}
              fill="#22c55e"
              fillOpacity={0.08}
              stroke="#16a34a"
              strokeDasharray="4 4"
              strokeOpacity={0.3}
            />

            <Area
              type="monotone"
              dataKey="meanTemp"
              name="Mean Temp (°C)"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tempGradient)"
            />
            <Line
              type="monotone"
              dataKey="maxTemp"
              name="Max Temp (°C)"
              stroke="#f59e0b"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="minTemp"
              name="Min Temp (°C)"
              stroke="#3b82f6"
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
