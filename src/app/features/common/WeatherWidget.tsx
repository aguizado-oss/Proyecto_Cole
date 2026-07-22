import { useEffect, useState } from "react";
import {
  Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow,
  Droplets, Eye, Gauge, Sun, Thermometer, Wind,
} from "lucide-react";

// Huancayo, Junín, Perú – coordenadas
const LAT = -12.0651;
const LON = -75.2049;
const CITY = "Huancayo";
const REGION = "Junín, Perú";
const TIMEZONE = "America/Lima";

interface WeatherData {
  temp: number;
  feelsLike: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  visibility: number;
  pressure: number;
  isDay: number;
}

interface HourlyForecast {
  time: string;
  temp: number;
  weatherCode: number;
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
  45: "Neblina", 48: "Neblina con escarcha", 51: "Llovizna ligera", 53: "Llovizna moderada",
  55: "Llovizna densa", 61: "Lluvia ligera", 63: "Lluvia moderada", 65: "Lluvia intensa",
  71: "Nevada ligera", 73: "Nevada moderada", 75: "Nevada intensa", 80: "Chubascos ligeros",
  81: "Chubascos moderados", 82: "Chubascos intensos", 95: "Tormenta eléctrica",
  96: "Tormenta con granizo", 99: "Tormenta fuerte con granizo",
};

function getWeatherIcon(code: number, isDay: number, size = 24) {
  const day = isDay === 1;
  if (code === 0 || code === 1) return day ? <Sun size={size} className="text-amber-400" /> : <Sun size={size} className="text-slate-300" />;
  if (code === 2 || code === 3) return <Cloud size={size} className="text-slate-400" />;
  if (code >= 51 && code <= 55) return <CloudDrizzle size={size} className="text-blue-400" />;
  if (code >= 61 && code <= 65) return <CloudRain size={size} className="text-blue-500" />;
  if (code >= 71 && code <= 75) return <CloudSnow size={size} className="text-sky-300" />;
  if (code >= 80 && code <= 82) return <CloudRain size={size} className="text-indigo-400" />;
  if (code >= 95) return <CloudLightning size={size} className="text-yellow-400" />;
  if (code === 45 || code === 48) return <Cloud size={size} className="text-slate-300" />;
  return <Sun size={size} className="text-amber-400" />;
}

function getBgGradient(code: number, isDay: number): string {
  if (isDay === 0) return "from-[#0f1b3d] via-[#1a2d5a] to-[#0f1b3d]";
  if (code === 0 || code === 1) return "from-[#1e4fa3] via-[#3a7bd5] to-[#f4a35a]";
  if (code === 2 || code === 3) return "from-[#4a6fa5] via-[#6b8fc4] to-[#9ab3d8]";
  if (code >= 51 && code <= 65) return "from-[#3a5a8a] via-[#4a7ab0] to-[#607d9a]";
  if (code >= 80 && code <= 82) return "from-[#2d4a7a] via-[#3d6a9a] to-[#5a7a9a]";
  if (code >= 95) return "from-[#1a2a4a] via-[#2a3a6a] to-[#1a2040]";
  return "from-[#1e4fa3] via-[#3a7bd5] to-[#f4a35a]";
}

function formatHour(isoTime: string): string {
  const d = new Date(isoTime);
  return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchWeather = async () => {
    try {
      setError(false);
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
        `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,surface_pressure,visibility,is_day` +
        `&hourly=temperature_2m,weather_code` +
        `&timezone=${encodeURIComponent(TIMEZONE)}&forecast_days=1`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const c = data.current;
      setWeather({
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        weatherCode: c.weather_code,
        windSpeed: Math.round(c.wind_speed_10m),
        humidity: c.relative_humidity_2m,
        visibility: Math.round((c.visibility ?? 10000) / 1000),
        pressure: Math.round(c.surface_pressure),
        isDay: c.is_day,
      });

      // Next 6 hours from current time
      const now = new Date();
      const nowH = now.getHours();
      const times: HourlyForecast[] = [];
      for (let i = 0; i < data.hourly.time.length && times.length < 6; i++) {
        const hh = new Date(data.hourly.time[i]).getHours();
        if (hh >= nowH) {
          times.push({
            time: data.hourly.time[i],
            temp: Math.round(data.hourly.temperature_2m[i]),
            weatherCode: data.hourly.weather_code[i],
          });
        }
      }
      setHourly(times);

      const now2 = new Date();
      setLastUpdated(now2.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-[#1e4fa3] via-[#3a7bd5] to-[#5a9ae0] p-5 shadow-lg">
        <div className="flex animate-pulse items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/20" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-white/20" />
            <div className="h-7 w-16 rounded bg-white/20" />
            <div className="h-3 w-32 rounded bg-white/20" />
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-white/50">Obteniendo clima…</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Cloud size={32} className="text-red-300" />
          <div>
            <p className="text-sm font-semibold text-red-700">No se pudo cargar el clima</p>
            <p className="text-xs text-red-400">Verifica tu conexión</p>
          </div>
          <button
            onClick={fetchWeather}
            className="ml-auto rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const gradient = getBgGradient(weather.weatherCode, weather.isDay);
  const description = WMO_DESCRIPTIONS[weather.weatherCode] ?? "Sin datos";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 shadow-lg shadow-blue-900/20`}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/5" />

      {/* Header */}
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{REGION}</span>
          </div>
          <p className="mt-0.5 text-base font-extrabold text-white">{CITY}</p>
        </div>
        <button
          onClick={fetchWeather}
          title="Actualizar clima"
          className="rounded-lg bg-white/10 p-1.5 text-white/70 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

      {/* Main temp */}
      <div className="relative mt-4 flex items-end gap-4">
        <div>{getWeatherIcon(weather.weatherCode, weather.isDay, 52)}</div>
        <div>
          <span className="text-5xl font-black text-white leading-none">{weather.temp}°</span>
          <span className="ml-1 text-lg font-semibold text-white/60">C</span>
          <p className="mt-1 text-sm font-medium text-white/80">{description}</p>
          <p className="text-[11px] text-white/50">Sensación: {weather.feelsLike}°C</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="relative mt-5 grid grid-cols-4 gap-2">
        {[
          { icon: <Wind size={13} />, label: "Viento", value: `${weather.windSpeed} km/h` },
          { icon: <Droplets size={13} />, label: "Humedad", value: `${weather.humidity}%` },
          { icon: <Eye size={13} />, label: "Visib.", value: `${weather.visibility} km` },
          { icon: <Gauge size={13} />, label: "Presión", value: `${weather.pressure} hPa` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="rounded-xl bg-white/10 p-2 text-center backdrop-blur-sm">
            <span className="flex items-center justify-center text-white/60">{icon}</span>
            <p className="mt-1 text-[9px] text-white/50">{label}</p>
            <p className="text-[10px] font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Hourly forecast */}
      {hourly.length > 0 && (
        <div className="relative mt-4">
          <div className="mb-2 flex items-center gap-1">
            <Thermometer size={11} className="text-white/40" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Próximas horas</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {hourly.map((h, i) => (
              <div
                key={h.time}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 ${
                  i === 0 ? "bg-white/20" : "bg-white/10"
                } backdrop-blur-sm`}
              >
                <span className="text-[10px] font-semibold text-white/70">{i === 0 ? "Ahora" : formatHour(h.time)}</span>
                <span>{getWeatherIcon(h.weatherCode, 1, 16)}</span>
                <span className="text-[11px] font-bold text-white">{h.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="relative mt-3 text-right text-[9px] text-white/30">
        Actualizado {lastUpdated} · Open-Meteo
      </p>
    </div>
  );
}
