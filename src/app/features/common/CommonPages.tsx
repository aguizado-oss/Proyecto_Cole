import { BookOpen, CalendarDays, ClipboardList, CreditCard, Library, Sparkles } from "lucide-react";
import type { SessionUser } from "../../types";

export function HomePage({ user }: { user: SessionUser }) {
  const cards = [
    { icon: CalendarDays, label: "Próxima clase", value: "Matemática · 8:00", tone: "bg-[#FFF0E1] text-[#A9571C]" },
    { icon: ClipboardList, label: "Pendientes", value: "5 actividades", tone: "bg-[#EAF5F1] text-[#287665]" },
    { icon: BookOpen, label: "Cursos", value: "4 publicados", tone: "bg-[#EEF1FB] text-[#4D62A3]" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-9 lg:py-10">
      <div className="overflow-hidden rounded-[28px] bg-[#19345D] p-7 text-white shadow-xl shadow-[#19345D]/10 sm:p-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FFD59E]"><Sparkles size={15} /> Bimestre III 2026</div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Hola, {user.name.split(" ")[0]}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">Todo está listo para continuar aprendiendo. Revisa tus clases y actividades de hoy.</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={19} /></span>
            <p className="mt-4 text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-[#19345D]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlaceholderPage({ type }: { type: "pagos" | "tramites" | "mas" }) {
  const details = {
    pagos: { icon: CreditCard, title: "Pagos", text: "Aquí podrás consultar tus cuotas, comprobantes y medios de pago." },
    tramites: { icon: ClipboardList, title: "Trámites", text: "Próximamente podrás realizar solicitudes y seguir su estado." },
    mas: { icon: Library, title: "Más servicios", text: "Biblioteca, eventos y refuerzos académicos estarán disponibles aquí." },
  }[type];
  const Icon = details.icon;
  return <div className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-6 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0E1] text-[#E76F3C]"><Icon size={28} /></span><h1 className="mt-5 text-2xl font-bold text-[#19345D]">{details.title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{details.text}</p><span className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-400 shadow-sm">Próximamente</span></div>;
}
