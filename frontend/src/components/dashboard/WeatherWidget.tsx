import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Compass
} from 'lucide-react';
import { CurrentWeather } from '../../types/index.js';

interface WeatherWidgetProps {
  weather: CurrentWeather | null;
  locationName?: string;
  loading?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  locationName = 'Farm Station',
  loading = false
}) => {
  if (loading || !weather) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
        <div className="h-10 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
          <div className="h-12 bg-slate-100 rounded"></div>
        </div>
      </div>
    );
  }

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
      case 'SunMedium': return <SunMedium className="w-8 h-8 text-amber-500" />;
      case 'CloudSun': return <CloudSun className="w-8 h-8 text-amber-500" />;
      case 'Cloud': return <Cloud className="w-8 h-8 text-slate-400" />;
      case 'CloudFog': return <CloudFog className="w-8 h-8 text-slate-400" />;
      case 'CloudDrizzle': return <CloudDrizzle className="w-8 h-8 text-blue-400" />;
      case 'CloudRain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'CloudLightning': return <CloudLightning className="w-8 h-8 text-purple-500" />;
      case 'Snowflake': return <Snowflake className="w-8 h-8 text-cyan-400" />;
      default: return <CloudSun className="w-8 h-8 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/40 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 block">
            Live Meteorological Station
          </span>
          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
            <span>{locationName}</span>
          </h3>
        </div>
        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
          {getWeatherIcon(weather.condition.icon)}
        </div>
      </div>

      <div className="flex items-baseline space-x-3 mb-5">
        <span className="text-4xl font-extrabold tracking-tight text-white">
          {weather.temperature}°C
        </span>
        <div className="text-xs text-slate-300">
          <p className="font-medium text-emerald-300">{weather.condition.label}</p>
          <p className="text-slate-400">Feels like {weather.feelsLike}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/10 text-xs">
        <div className="bg-white/5 rounded-xl p-2.5">
          <div className="flex items-center space-x-1 text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Humidity</span>
          </div>
          <span className="font-semibold text-white">{weather.humidity}%</span>
        </div>

        <div className="bg-white/5 rounded-xl p-2.5">
          <div className="flex items-center space-x-1 text-slate-400 mb-1">
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            <span>Wind</span>
          </div>
          <span className="font-semibold text-white">{weather.windSpeed} km/h</span>
        </div>

        <div className="bg-white/5 rounded-xl p-2.5">
          <div className="flex items-center space-x-1 text-slate-400 mb-1">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>UV Index</span>
          </div>
          <span className="font-semibold text-white">{weather.uvIndex} Max</span>
        </div>
      </div>
    </div>
  );
};
