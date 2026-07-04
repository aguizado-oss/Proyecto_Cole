import { useState, useEffect } from "react";
import { addDays, addWeeks, subWeeks, startOfWeek, isToday } from "date-fns";
import {
  Home, Calendar, BookOpen, CreditCard, FileText,
  MoreHorizontal, HelpCircle, ChevronDown, ChevronLeft,
  ChevronRight, MapPin, Wifi, Menu, Bell, Eye, EyeOff, Lock, User, LogOut,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const HOUR_START = 7;
const HOUR_END = 19;
const HOUR_HEIGHT = 68;
const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);
const DAY_ABBR = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// ─── Types ────────────────────────────────────────────────────────────────────
interface CalendarEvent {
  id: string;
  dayOfWeek: number; // 0=Mon … 6=Sun
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  course: string;
  room: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const EVENTS: CalendarEvent[] = [
  { id: "1",  dayOfWeek: 0, startHour: 8,  startMin: 0, endHour: 10, endMin: 0, course: "Cálculo Diferencial", room: "A0302" },
  { id: "2",  dayOfWeek: 0, startHour: 15, startMin: 0, endHour: 17, endMin: 0, course: "Inglés Técnico",      room: "D0105" },
  { id: "3",  dayOfWeek: 1, startHour: 10, startMin: 0, endHour: 12, endMin: 0, course: "Álgebra Lineal",      room: "A0204" },
  { id: "4",  dayOfWeek: 1, startHour: 16, startMin: 0, endHour: 17, endMin: 30, course: "Programación I",    room: "B0201" },
  { id: "5",  dayOfWeek: 2, startHour: 8,  startMin: 0, endHour: 10, endMin: 0, course: "Física General",     room: "C0105" },
  { id: "6",  dayOfWeek: 2, startHour: 14, startMin: 0, endHour: 16, endMin: 0, course: "Cálculo Diferencial",room: "A0302" },
  { id: "7",  dayOfWeek: 3, startHour: 9,  startMin: 0, endHour: 11, endMin: 0, course: "Inglés Técnico",     room: "D0105" },
  { id: "8",  dayOfWeek: 3, startHour: 14, startMin: 0, endHour: 15, endMin: 30, course: "Álgebra Lineal",    room: "A0204" },
  { id: "9",  dayOfWeek: 4, startHour: 8,  startMin: 0, endHour: 10, endMin: 0, course: "Física General",     room: "C0105" },
  { id: "10", dayOfWeek: 4, startHour: 14, startMin: 0, endHour: 16, endMin: 0, course: "Programación I",     room: "B0201" },
];

const VIRTUAL_COURSES = ["Cálculo Integral", "Comunicación Efectiva", "Ética Profesional"];

const NAV_ITEMS = [
  { icon: Home,          label: "Inicio",     id: "inicio"    },
  { icon: Calendar,      label: "Calendario", id: "calendario"},
  { icon: BookOpen,      label: "Cursos",     id: "cursos"    },
  { icon: CreditCard,    label: "Pagos",      id: "pagos"     },
  { icon: FileText,      label: "Trámites",   id: "tramites"  },
  { icon: MoreHorizontal,label: "···",        id: "more"      },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d: Date) {
  return `${d.getDate()} ${MONTH_ES[d.getMonth()]}`;
}

function fmtHour(h: number, m: number) {
  return `${h}:${m === 0 ? "00" : m}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function App() {
  const TODAY = new Date(2026, 6, 3); // July 3 2026 — match system date
  const [baseDate, setBaseDate]       = useState(TODAY);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNav, setActiveNav]     = useState("calendario");

  // Authentication & Interface State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const cleanId = studentId.trim();
    if (!cleanId) {
      setLoginError("Por favor ingresa tu código de estudiante.");
      return;
    }

    if (!/^[uU]\d{8}$/.test(cleanId)) {
      setLoginError("El código de estudiante debe empezar con 'U' seguido de 8 números (Ej. U20231045).");
      return;
    }

    if (!password) {
      setLoginError("Por favor ingresa tu contraseña.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (cleanId.toUpperCase() === "U20231045" && password === "utp12345") {
        setIsLoggedIn(true);
      } else {
        setLoginError("Código o contraseña incorrectos. Usa los datos demo indicados abajo.");
      }
    }, 1000);
  };

  const fillDemoCredentials = () => {
    setStudentId("U20231045");
    setPassword("utp12345");
    setLoginError("");
  };

  const weekStart   = startOfWeek(baseDate, { weekStartsOn: 1 });
  const days        = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const isThisWeek  = days.some(d => isToday(d));
  const weekLabel   = `${fmtDate(days[0])} — ${fmtDate(days[6])} ${days[6].getFullYear()}`;
  const todayDecimal = currentTime.getHours() + currentTime.getMinutes() / 60;
  const showNowLine = isThisWeek && todayDecimal >= HOUR_START && todayDecimal <= HOUR_END;
  const nowTop      = (todayDecimal - HOUR_START) * HOUR_HEIGHT;

  if (!isLoggedIn) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Left Side: Login Form */}
        <div className="flex w-full flex-col justify-between bg-white p-8 md:w-[480px] lg:w-[520px] xl:w-[560px] z-10 shadow-xl">
          {/* Header Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F05545] font-bold text-white shadow-md">
              UTP
            </div>
            <div>
              <span className="block text-sm font-extrabold text-[#1A2E5A] tracking-tight">UTP +portal</span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Portal Oficial</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="my-auto py-10 max-w-sm w-full mx-auto">
            <h2 className="text-3xl font-extrabold text-[#1A2E5A] tracking-tight">¡Hola de nuevo!</h2>
            <p className="text-sm text-slate-500 mt-2">
              Ingresa tus credenciales para acceder a tus cursos, horarios y trámites académicos.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                  {loginError}
                </div>
              )}

              {/* ID Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Código de Estudiante</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ej. U20231045"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#6C4FD8] focus:ring-2 focus:ring-[#6c4fd8]/10"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">Contraseña</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Por favor, usa la contraseña de prueba: utp12345"); }} className="text-xs font-semibold text-[#6C4FD8] hover:underline">¿La olvidaste?</a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-[#6C4FD8] focus:ring-2 focus:ring-[#6c4fd8]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#6C4FD8] focus:ring-[#6C4FD8]"
                  defaultChecked
                />
                <label htmlFor="remember-me" className="ml-2 text-xs font-medium text-slate-600">
                  Mantener mi sesión iniciada
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#1A2E5A] py-3 text-sm font-semibold text-white transition-all hover:bg-[#122040] hover:shadow-lg active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : "Iniciar Sesión"}
              </button>
            </form>

            {/* Test Credentials Box */}
            <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-xs font-bold text-[#1A2E5A] uppercase tracking-wider mb-2">Credenciales de Acceso Demo</span>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Código:</span>
                  <span className="font-mono font-bold text-slate-800">U20231045</span>
                </div>
                <div className="flex justify-between">
                  <span>Contraseña:</span>
                  <span className="font-mono font-bold text-slate-800">utp12345</span>
                </div>
              </div>
              <button
                onClick={fillDemoCredentials}
                className="mt-3 w-full py-1.5 px-3 rounded-lg border border-dashed border-[#6C4FD8]/40 hover:border-[#6C4FD8] text-[11px] font-semibold text-[#6C4FD8] hover:bg-[#6c4fd8]/5 transition-all text-center cursor-pointer"
              >
                Autocompletar Datos Demo
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400">
            © 2026 Universidad Tecnológica del Perú. Todos los derechos reservados.
          </div>
        </div>

        {/* Right Side: Showcase */}
        <div className="relative hidden flex-1 bg-[#1A2E5A] md:flex md:flex-col md:justify-between p-12 overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#6C4FD8]/20 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#F05545]/10 to-transparent blur-3xl pointer-events-none" />

          {/* Top slogan */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-white/60 text-xs font-semibold tracking-widest uppercase">Portal Académico Estudiantil</span>
            <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Servidores Activos</span>
            </div>
          </div>

          {/* Showcase Main Content */}
          <div className="relative z-10 max-w-lg my-auto font-sans">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs text-white backdrop-blur-md mb-6 border border-white/5">
              <span>🚀</span>
              <span className="font-semibold">Nueva Versión Portal 4.2</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight lg:text-5xl">
              Toda tu vida académica, en un solo lugar.
            </h1>
            <p className="text-white/70 mt-4 leading-relaxed text-sm">
              Accede a tus horarios semanales en tiempo real, realiza el seguimiento de tus asignaturas presenciales y virtuales, consulta tus estados de pago y gestiona tus trámites administrativos con una interfaz renovada.
            </p>

            {/* Glassmorphic Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <span className="block text-2xl font-bold text-white">98%</span>
                <span className="block text-xs text-white/50 mt-1 font-medium">Asistencia en cursos</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <span className="block text-2xl font-bold text-white">15</span>
                <span className="block text-xs text-white/50 mt-1 font-medium">Créditos aprobados</span>
              </div>
            </div>
          </div>

          {/* Slogan Footer */}
          <div className="relative z-10 text-white/40 text-xs flex justify-between">
            <span>Soporte Académico: soporte@utp.edu.pe</span>
            <span>v4.2.0-lts</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden animate-in fade-in duration-300"
      style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#F4F5F9" }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside
        className="flex-shrink-0 flex flex-col bg-white"
        style={{ width: 100, boxShadow: "2px 0 12px rgba(0,0,0,0.05)", zIndex: 50 }}
      >
        {/* Hamburger block */}
        <button
          className="flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-85"
          style={{ height: 64, backgroundColor: "#F05545" }}
        >
          <Menu size={20} strokeWidth={2.5} color="#fff" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center py-4" style={{ borderBottom: "1px solid #F0F1F5" }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1A2E5A", letterSpacing: "-0.5px" }}>UTP</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: "#8B8FA8", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 1 }}>+portal</span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col flex-1 pt-3 pb-4 gap-0.5">
          {NAV_ITEMS.map(({ icon: Icon, label, id }) => {
            const active = id === activeNav;
            return (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                className="relative flex flex-col items-center py-3 gap-1.5 transition-all mx-2 rounded-xl"
                style={{
                  color: active ? "#F05545" : "#9BA0B5",
                  backgroundColor: active ? "#FFF1F0" : "transparent",
                }}
              >
                {active && (
                  <div
                    className="absolute left-0 top-2 bottom-2 rounded-r-full"
                    style={{ width: 3, backgroundColor: "#F05545", marginLeft: -8 }}
                  />
                )}
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                <span style={{ fontSize: 9.5, fontWeight: active ? 600 : 400, lineHeight: 1, letterSpacing: "0.01em" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── MAIN AREA ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header
          className="flex-shrink-0 flex items-center justify-between bg-white px-8"
          style={{ height: 64, borderBottom: "1px solid rgba(0,0,0,0.07)", zIndex: 40 }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: "#B0B3C6" }}>Portal Universitario</span>
            <span style={{ color: "#D8DAE5", fontSize: 14 }}>/</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2E5A" }}>Calendario</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              className="relative flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors"
              style={{ width: 38, height: 38, border: "1px solid #EAECF2" }}
            >
              <Bell size={15} strokeWidth={1.8} color="#8B8FA8" />
              <span
                className="absolute top-1.5 right-1.5 rounded-full"
                style={{ width: 6, height: 6, backgroundColor: "#F05545" }}
              />
            </button>

            {/* Help */}
            <button
              className="flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors"
              style={{ width: 38, height: 38, border: "1px solid #EAECF2" }}
            >
              <HelpCircle size={15} strokeWidth={1.8} color="#8B8FA8" />
            </button>

            {/* Divider */}
            <div style={{ width: 1, height: 28, backgroundColor: "#EAECF2" }} />

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ border: "1px solid #EAECF2" }}
              >
                <div className="text-right">
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1A2E5A", lineHeight: 1.4 }}>Hola, Alejandro</div>
                  <div style={{ fontSize: 10, color: "#8B8FA8", lineHeight: 1.3 }}>U20231045</div>
                </div>
                <div
                  className="flex items-center justify-center rounded-full font-bold text-white flex-shrink-0"
                  style={{ width: 34, height: 34, backgroundColor: "#6C4FD8", fontSize: 13 }}
                >
                  A
                </div>
                <ChevronDown size={13} strokeWidth={2.5} color="#8B8FA8" className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-1.5 shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setIsLoggedIn(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── CONTENT ─────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#F4F5F9" }}>

          {/* Page title + controls */}
          <div className="px-8 pt-8 pb-5">
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1A2E5A", letterSpacing: "-0.5px" }}>
              Calendario
            </h1>
            <p style={{ fontSize: 13, color: "#9BA0B5", marginTop: 4, fontWeight: 400 }}>
              Visualiza y organiza tus clases presenciales y actividades virtuales de la semana.
            </p>

            {/* Controls bar */}
            <div className="flex items-center gap-2.5 mt-5">
              {/* Week selector pill */}
              <button
                className="flex items-center gap-2 bg-white rounded-full px-4 py-2 hover:shadow-sm transition-all"
                style={{ border: "1px solid #E4E6EF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <Calendar size={14} color="#6C4FD8" strokeWidth={2} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1A2E5A" }}>{weekLabel}</span>
                <ChevronDown size={13} strokeWidth={2.5} color="#9BA0B5" />
              </button>

              {/* Today */}
              <button
                onClick={() => setBaseDate(TODAY)}
                className="rounded-full px-4 py-2 font-medium transition-colors hover:bg-purple-50"
                style={{ fontSize: 13, border: "1.5px solid #6C4FD8", color: "#6C4FD8" }}
              >
                Hoy
              </button>

              {/* Prev / Next */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => setBaseDate(d => subWeeks(d, 1))}
                  className="flex items-center justify-center rounded-xl text-white transition-opacity hover:opacity-80"
                  style={{ width: 36, height: 36, backgroundColor: "#1A2E5A" }}
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setBaseDate(d => addWeeks(d, 1))}
                  className="flex items-center justify-center rounded-xl text-white transition-opacity hover:opacity-80"
                  style={{ width: 36, height: 36, backgroundColor: "#1A2E5A" }}
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* ── CALENDAR CARD ──────────────────────────────────────────────── */}
          <div
            className="mx-8 mb-8 bg-white overflow-hidden"
            style={{
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            {/* Sticky header: day names + virtual banner */}
            <div className="sticky top-0 z-20 bg-white" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>

              {/* Day headers row */}
              <div className="flex" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                {/* Hour-label spacer */}
                <div style={{ width: 72, flexShrink: 0 }} />

                {days.map((day, i) => {
                  const active = isToday(day);
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center py-3 gap-1"
                      style={{ borderLeft: "1px solid rgba(0,0,0,0.04)" }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: active ? "#6C4FD8" : "#9BA0B5",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {DAY_ABBR[i]}
                      </span>
                      <span
                        className="flex items-center justify-center font-semibold"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          fontSize: 14,
                          backgroundColor: active ? "#6C4FD8" : "transparent",
                          color: active ? "#fff" : "#1A2E5A",
                          transition: "background-color 0.2s",
                        }}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Virtual banner */}
              <div className="flex" style={{ backgroundColor: "#C62B72" }}>
                <div style={{ width: 72, flexShrink: 0, backgroundColor: "#B82369" }} />
                <div
                  className="flex-1 flex items-center gap-3 px-4 py-2.5"
                  style={{ backgroundColor: "#C62B72" }}
                >
                  {/* Virtual 24/7 pill */}
                  <span
                    className="flex-shrink-0 rounded-full font-semibold"
                    style={{
                      fontSize: 9.5,
                      color: "#fff",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      padding: "2px 8px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Virtual 24/7
                  </span>

                  {/* Course count */}
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    3 Cursos
                  </span>

                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>·</span>

                  {/* Course list */}
                  <div className="flex items-center gap-2 min-w-0">
                    {VIRTUAL_COURSES.map((c, i) => (
                      <span key={i} className="flex items-center gap-2">
                        {i > 0 && <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>·</span>}
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }}>{c}</span>
                      </span>
                    ))}
                  </div>

                  {/* Right action */}
                  <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
                    <Wifi size={12} strokeWidth={2} color="rgba(255,255,255,0.8)" />
                    <span
                      className="underline underline-offset-2 cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}
                    >
                      Acceder a plataforma
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── GRID BODY ──────────────────────────────────────────────────── */}
            <div className="flex" style={{ height: (HOUR_END - HOUR_START + 1) * HOUR_HEIGHT }}>

              {/* Hour labels */}
              <div className="flex-shrink-0 flex flex-col" style={{ width: 72 }}>
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="flex-shrink-0 flex items-start justify-end pr-3"
                    style={{ height: HOUR_HEIGHT, paddingTop: 6 }}
                  >
                    <span style={{ fontSize: 11, color: "#B8BBCC", fontWeight: 400, lineHeight: 1 }}>
                      {hour}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map((day, dayIndex) => {
                const active     = isToday(day);
                const dayEvents  = EVENTS.filter(e => e.dayOfWeek === dayIndex);

                return (
                  <div
                    key={dayIndex}
                    className="flex-1 relative"
                    style={{
                      borderLeft: "1px solid rgba(0,0,0,0.05)",
                      backgroundColor: active ? "rgba(108,79,216,0.025)" : "transparent",
                    }}
                  >
                    {/* Hour grid lines */}
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        style={{
                          position: "absolute",
                          top: (hour - HOUR_START) * HOUR_HEIGHT,
                          left: 0,
                          right: 0,
                          height: HOUR_HEIGHT,
                          borderBottom: "1px solid rgba(0,0,0,0.04)",
                        }}
                      />
                    ))}

                    {/* Half-hour marks */}
                    {HOURS.map((hour) => (
                      <div
                        key={`h-${hour}`}
                        style={{
                          position: "absolute",
                          top: (hour - HOUR_START) * HOUR_HEIGHT + HOUR_HEIGHT / 2,
                          left: 0,
                          right: 0,
                          borderBottom: "1px dashed rgba(0,0,0,0.025)",
                          pointerEvents: "none",
                        }}
                      />
                    ))}

                    {/* Current time indicator */}
                    {active && showNowLine && (
                      <div
                        style={{
                          position: "absolute",
                          top: nowTop,
                          left: -1,
                          right: 0,
                          height: 0,
                          zIndex: 15,
                          display: "flex",
                          alignItems: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: "#6C4FD8",
                            flexShrink: 0,
                            marginLeft: -5,
                            boxShadow: "0 0 0 3px rgba(108,79,216,0.2)",
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            height: 1.5,
                            backgroundImage:
                              "repeating-linear-gradient(90deg, #6C4FD8 0px, #6C4FD8 6px, transparent 6px, transparent 12px)",
                            opacity: 0.65,
                          }}
                        />
                      </div>
                    )}

                    {/* Event cards */}
                    {dayEvents.map((ev) => {
                      const startDec = ev.startHour + ev.startMin / 60;
                      const endDec   = ev.endHour   + ev.endMin   / 60;
                      const top      = (startDec - HOUR_START) * HOUR_HEIGHT + 4;
                      const height   = (endDec - startDec) * HOUR_HEIGHT - 8;
                      const short    = height < 70;

                      return (
                        <div
                          key={ev.id}
                          style={{
                            position: "absolute",
                            top,
                            height,
                            left: 5,
                            right: 5,
                            backgroundColor: "#A85A2E",
                            borderRadius: 10,
                            padding: short ? "6px 8px" : "10px 11px",
                            display: "flex",
                            flexDirection: "column",
                            gap: short ? 2 : 4,
                            cursor: "pointer",
                            zIndex: 5,
                            transition: "opacity 0.15s, transform 0.15s",
                            overflow: "hidden",
                          }}
                          className="hover:opacity-90 hover:scale-[1.01]"
                        >
                          {/* Presencial pill */}
                          <span
                            style={{
                              alignSelf: "flex-start",
                              backgroundColor: "rgba(255,255,255,0.22)",
                              color: "#fff",
                              fontSize: 8.5,
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              padding: "1.5px 6px",
                              borderRadius: 99,
                              lineHeight: 1.5,
                              flexShrink: 0,
                            }}
                          >
                            Presencial
                          </span>

                          {/* Course name */}
                          <span
                            style={{
                              color: "#fff",
                              fontSize: short ? 11 : 12,
                              fontWeight: 700,
                              lineHeight: 1.3,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: short ? 1 : 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {ev.course}
                          </span>

                          {!short && (
                            <>
                              {/* Time */}
                              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 10.5, lineHeight: 1 }}>
                                {fmtHour(ev.startHour, ev.startMin)} — {fmtHour(ev.endHour, ev.endMin)}
                              </span>
                              {/* Room */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 3,
                                  color: "rgba(255,255,255,0.65)",
                                  fontSize: 10,
                                  marginTop: 1,
                                }}
                              >
                                <MapPin size={9} strokeWidth={2.5} />
                                <span>{ev.room}</span>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
