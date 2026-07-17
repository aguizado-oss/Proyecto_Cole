import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  Bell, BookOpen, CalendarDays, ChevronDown, CreditCard, FileText, HelpCircle,
  Home, LogOut, Menu, MoreHorizontal, Settings,
} from "lucide-react";
import { GuidedTour, type TourStep } from "./GuidedTour";
import type { SessionUser } from "../types";

const studentNavigation = [
  { icon: Home, label: "Inicio", id: "inicio", to: "/" },
  { icon: CalendarDays, label: "Calendario", id: "calendario", to: "/calendario" },
  { icon: BookOpen, label: "Cursos", id: "cursos", to: "/cursos" },
  { icon: CreditCard, label: "Pagos", id: "pagos", to: "/pagos" },
  { icon: FileText, label: "Trámites", id: "tramites", to: "/tramites" },
  { icon: MoreHorizontal, label: "···", id: "more", to: "/mas" },
];

const tourSteps: TourStep[] = [
  { targetId: "inicio", title: "Inicio", description: "Revisa la información actual que necesitas para tu vida escolar." },
  { targetId: "calendario", title: "Calendario", description: "Consulta tus clases, aulas y actividades organizadas por semana." },
  { targetId: "cursos", title: "Cursos", description: "Accede al contenido, tareas, evaluaciones y progreso de cada curso." },
  { targetId: "pagos", title: "Pagos", description: "Revisa tus pagos pendientes y realizados, junto con las opciones disponibles." },
  { targetId: "tramites", title: "Trámites", description: "Realiza trámites y conoce los requisitos y plazos de cada solicitud." },
  { targetId: "more", title: "Más opciones", description: "Descubre eventos, refuerzos académicos y recursos de biblioteca." },
];

const pageNames: Record<string, string> = {
  "/": "Inicio",
  "/calendario": "Calendario",
  "/cursos": "Cursos",
  "/pagos": "Pagos",
  "/tramites": "Trámites",
  "/mas": "Más opciones",
  "/admin": "Administración académica",
};

interface PortalLayoutProps {
  user: SessionUser;
  onLogout: () => void;
}

function SidebarLink({ item }: { item: typeof studentNavigation[number] }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      data-tour-id={item.id}
      className={({ isActive }) => `group relative mx-2 flex flex-col items-center gap-1.5 rounded-xl py-3 transition-all ${
        isActive ? "bg-[#FFF0E8] text-[#E76F3C]" : "text-slate-400 hover:bg-slate-50 hover:text-[#19345D]"
      }`}
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute -left-2 bottom-2 top-2 w-[3px] rounded-r-full bg-[#F07845]" />}
          <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
          <span className="text-[9.5px] leading-none">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function MobileLink({ item }: { item: typeof studentNavigation[number] }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      data-tour-id={item.id}
      className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[8px] transition-colors ${
        isActive ? "bg-[#FFF0E8] text-[#E76F3C]" : "text-slate-400"
      }`}
    >
      <Icon size={17} />
      <span className="max-w-full truncate">{item.label}</span>
    </NavLink>
  );
}

export function PortalLayout({ user, onLogout }: PortalLayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const courseDetail = location.pathname.match(/^\/cursos\/([^/]+)/);
  const pageName = courseDetail ? "Detalle del curso" : pageNames[location.pathname] ?? "Portal";

  return (
    <div className="flex h-dvh overflow-hidden bg-[#F7F5F0] font-['Poppins',sans-serif] text-[#19345D]">
      <aside className="relative z-40 hidden w-[100px] shrink-0 flex-col bg-white shadow-[2px_0_14px_rgba(25,52,93,.06)] md:flex">
        <button className="flex h-16 shrink-0 items-center justify-center bg-[#F07845] text-white" aria-label="Abrir menú">
          <Menu size={21} strokeWidth={2.5} />
        </button>
        <button onClick={() => navigate("/")} className="border-b border-slate-100 py-4 text-center">
          <span className="block text-lg font-extrabold tracking-tight text-[#19345D]">GUIZADITO</span>
          <span className="block text-[8px] font-semibold uppercase tracking-[.14em] text-[#E76F3C]">Horizonte</span>
        </button>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto pb-3 pt-3">
          {studentNavigation.map((item) => <SidebarLink item={item} key={item.id} />)}
          {user.role === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => `mx-2 mt-auto flex flex-col items-center gap-1.5 rounded-xl py-3 ${isActive ? "bg-[#EAF5F1] text-[#287665]" : "text-slate-400 hover:bg-slate-50"}`}>
              <Settings size={19} />
              <span className="text-[9px]">Administrar</span>
            </NavLink>
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-black/5 bg-white px-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="hidden text-[11px] text-slate-400 sm:block">Colegio Horizonte <span className="mx-1 text-slate-300">/</span></p>
            <p className="truncate text-sm font-semibold text-[#19345D]">{pageName}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {user.role === "admin" && (
              <button onClick={() => navigate("/admin")} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 md:hidden" aria-label="Administración académica">
                <Settings size={16} />
              </button>
            )}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50" aria-label="Notificaciones">
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F07845]" />
            </button>
            <button
              onClick={() => setTourActive(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors hover:border-[#F07845]/40 hover:bg-[#FFF7F1] hover:text-[#E76F3C]"
              aria-label="Iniciar tour guiado"
            >
              <HelpCircle size={16} />
            </button>
            <div className="hidden h-7 w-px bg-slate-200 sm:block" />
            <div className="relative">
              <button onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-xl border border-slate-200 py-1 pl-1 pr-2 hover:bg-slate-50">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#287665] text-xs font-bold text-white">{user.name.charAt(0)}</span>
                <span className="hidden text-left sm:block">
                  <span className="block max-w-32 truncate text-[11px] font-semibold text-[#19345D]">Hola, {user.name.split(" ")[0]}</span>
                  <span className="block text-[9px] text-slate-400">{user.code}</span>
                </span>
                <ChevronDown size={13} className={`hidden text-slate-400 transition-transform sm:block ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
                  <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50">
                    <LogOut size={14} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-[72px] items-center gap-0.5 border-t border-slate-200 bg-white px-1.5 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(25,52,93,.08)] md:hidden">
        {studentNavigation.map((item) => <MobileLink item={item} key={item.id} />)}
      </nav>

      <GuidedTour steps={tourSteps} active={tourActive} onClose={() => setTourActive(false)} />
    </div>
  );
}
