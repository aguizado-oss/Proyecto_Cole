import { useState, type FormEvent } from "react";
import { BookOpenCheck, Eye, EyeOff, Lock, Sparkles, User } from "lucide-react";
import type { SessionUser } from "../../types";

interface LoginPageProps {
  onLogin: (user: SessionUser) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (normalized === "U20231045" && password === "utp12345") {
      onLogin({ id: "u-student", studentId: "student-1", name: "Xamir Alumno", code: "U20231045", role: "estudiante", sectionId: "s3a" });
      return;
    }
    if (normalized === "ADMIN2026" && password === "admin12345") {
      onLogin({ id: "u-admin", name: "Ana Administradora", code: "ADMIN2026", role: "admin" });
      return;
    }
    setError("Credenciales incorrectas. Usa una de las cuentas demo.");
  };

  const fillStudent = () => {
    setCode("U20231045");
    setPassword("utp12345");
    setError("");
  };

  const fillAdmin = () => {
    setCode("ADMIN2026");
    setPassword("admin12345");
    setError("");
  };

  return (
    <div className="min-h-dvh bg-[#F8F3E9] font-['Poppins',sans-serif] md:grid md:grid-cols-[minmax(390px,520px)_1fr]">
      <section className="flex min-h-dvh flex-col bg-white px-6 py-7 sm:px-10 lg:px-14">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F07845] text-sm font-black text-white shadow-[0_7px_20px_rgba(240,120,69,.25)]">CH</div>
          <div>
            <p className="text-sm font-extrabold text-[#19345D]">Colegio Horizonte</p>
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#287665]">Portal académico</p>
          </div>
        </div>

        <div className="mx-auto my-auto w-full max-w-sm py-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#EAF5F1] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#287665]">
            <Sparkles size={13} /> Tu espacio escolar
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#19345D]">Bienvenido de vuelta</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Ingresa para consultar tus cursos, tareas y actividades de la semana.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600">{error}</div>}
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Código</span>
              <span className="relative block">
                <User className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input value={code} onChange={(event) => setCode(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#F07845] focus:ring-4 focus:ring-[#F07845]/10" placeholder="Código de estudiante" required />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">Contraseña</span>
              <span className="relative block">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={16} />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-[#F07845] focus:ring-4 focus:ring-[#F07845]/10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-3.5 text-slate-400" aria-label="Mostrar contraseña">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            <button className="w-full rounded-xl bg-[#19345D] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#19345D]/10 transition hover:bg-[#102641]">Ingresar al portal</button>
          </form>

          <div className="mt-7 rounded-2xl border border-dashed border-[#E8C8AA] bg-[#FFF9F3] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#A9571C]">Accesos demo</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={fillStudent} className="rounded-xl border border-[#F0DAC8] bg-white px-3 py-2.5 text-left text-[10px] text-slate-500 hover:border-[#F07845]">
                <strong className="block text-xs text-[#19345D]">Estudiante</strong>U20231045
              </button>
              <button onClick={fillAdmin} className="rounded-xl border border-[#F0DAC8] bg-white px-3 py-2.5 text-left text-[10px] text-slate-500 hover:border-[#F07845]">
                <strong className="block text-xs text-[#19345D]">Administrador</strong>ADMIN2026
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-400">© 2026 Colegio Horizonte. Aprender para transformar.</p>
      </section>

      <section className="relative hidden overflow-hidden bg-[#19345D] p-12 md:flex md:flex-col md:justify-between">
        <div className="absolute -right-36 -top-40 h-[520px] w-[520px] rounded-full bg-[#F07845]/20 blur-2xl" />
        <div className="absolute -bottom-36 -left-20 h-[420px] w-[420px] rounded-full bg-[#3EA58B]/20 blur-2xl" />
        <p className="relative z-10 text-xs font-bold uppercase tracking-[.2em] text-white/50">Primaria y secundaria</p>
        <div className="relative z-10 max-w-xl">
          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#FFD59E] backdrop-blur"><BookOpenCheck size={31} /></div>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">Cada día abre un nuevo horizonte.</h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/65">Cursos, materiales y acompañamiento docente reunidos en un espacio diseñado para aprender con curiosidad y confianza.</p>
          <div className="mt-10 flex gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/75">4 cursos activos</span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-xs text-white/75">Bimestre III</span>
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/35">soporte@horizonte.edu.pe</p>
      </section>
    </div>
  );
}
