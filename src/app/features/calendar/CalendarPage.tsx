import { useEffect, useState } from "react";
import { addDays, addWeeks, isToday, startOfWeek, subWeeks } from "date-fns";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, MapPin, Wifi } from "lucide-react";

const HOUR_START = 7;
const HOUR_END = 19;
const HOUR_HEIGHT = 68;
const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, index) => HOUR_START + index);
const DAY_ABBR = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const events = [
  { id: "1", day: 0, start: 8, end: 9.5, course: "Matemática", room: "A0301" },
  { id: "2", day: 0, start: 11, end: 12.5, course: "Educación Física", room: "Patio" },
  { id: "3", day: 1, start: 10, end: 11.5, course: "Comunicación", room: "A0202" },
  { id: "4", day: 1, start: 14, end: 15.5, course: "Arte y Cultura", room: "Taller 01" },
  { id: "5", day: 2, start: 8, end: 9.5, course: "Matemática", room: "A0301" },
  { id: "6", day: 2, start: 11, end: 12.5, course: "Inglés", room: "A0104" },
  { id: "7", day: 3, start: 9, end: 10.5, course: "Ciencia y Tecnología", room: "Lab 02" },
  { id: "8", day: 3, start: 14, end: 15.5, course: "Comunicación", room: "A0202" },
  { id: "9", day: 4, start: 8, end: 9.5, course: "Inglés", room: "A0104" },
  { id: "10", day: 4, start: 10, end: 11.5, course: "Tutoría", room: "A0301" },
];

const formatShortDate = (date: Date) => `${date.getDate()} ${MONTH_ES[date.getMonth()]}`;
const formatHour = (decimal: number) => `${Math.floor(decimal)}:${decimal % 1 ? "30" : "00"}`;

export function CalendarPage() {
  const [baseDate, setBaseDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const weekLabel = `${formatShortDate(days[0])} - ${formatShortDate(days[6])} ${days[6].getFullYear()}`;
  const isCurrentWeek = days.some((day) => isToday(day));
  const currentDecimal = currentTime.getHours() + currentTime.getMinutes() / 60;
  const showNow = isCurrentWeek && currentDecimal >= HOUR_START && currentDecimal <= HOUR_END;

  return (
    <div className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#E76F3C]">Agenda escolar</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#19345D]">Calendario</h1><p className="mt-1 text-sm text-slate-500">Visualiza tus clases presenciales y actividades virtuales.</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#19345D] shadow-sm"><CalendarDays size={14} className="text-[#287665]" />{weekLabel}<ChevronDown size={13} className="text-slate-400" /></button>
            <button onClick={() => setBaseDate(new Date())} className="rounded-full border border-[#F07845] px-4 py-2 text-xs font-semibold text-[#E76F3C] hover:bg-[#FFF0E8]">Hoy</button>
            <button onClick={() => setBaseDate((date) => subWeeks(date, 1))} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#19345D] text-white"><ChevronLeft size={16} /></button>
            <button onClick={() => setBaseDate((date) => addWeeks(date, 1))} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#19345D] text-white"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[22px] border border-black/5 bg-white shadow-[0_5px_24px_rgba(25,52,93,.06)]">
          <div className="min-w-[980px]">
            <div className="sticky top-0 z-20 bg-white">
              <div className="flex border-b border-slate-100">
                <div className="w-[72px] shrink-0" />
                {days.map((day, index) => <div key={day.toISOString()} className="flex flex-1 flex-col items-center gap-1 border-l border-slate-100 py-3"><span className={`text-[9px] font-bold uppercase tracking-wider ${isToday(day) ? "text-[#E76F3C]" : "text-slate-400"}`}>{DAY_ABBR[index]}</span><span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${isToday(day) ? "bg-[#F07845] text-white" : "text-[#19345D]"}`}>{day.getDate()}</span></div>)}
              </div>
              <div className="flex bg-[#287665] text-white"><div className="w-[72px] shrink-0 bg-[#236959]" /><div className="flex flex-1 items-center gap-3 px-4 py-2.5"><span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-bold uppercase">Virtual 24/7</span><strong className="text-xs">1 curso</strong><span className="text-white/30">·</span><span className="text-xs text-white/80">Ciencia y Tecnología</span><span className="ml-auto flex items-center gap-1 text-[10px] text-white/75"><Wifi size={12} /> Acceder al aula</span></div></div>
            </div>
            <div className="flex" style={{ height: HOURS.length * HOUR_HEIGHT }}>
              <div className="w-[72px] shrink-0">{HOURS.map((hour) => <div key={hour} className="pr-3 pt-1.5 text-right text-[10px] text-slate-400" style={{ height: HOUR_HEIGHT }}>{hour}:00</div>)}</div>
              {days.map((day, dayIndex) => <div key={day.toISOString()} className={`relative flex-1 border-l border-slate-100 ${isToday(day) ? "bg-[#FFF9F3]" : ""}`}>
                {HOURS.map((hour) => <div key={hour} className="absolute left-0 right-0 border-b border-slate-100" style={{ top: (hour - HOUR_START) * HOUR_HEIGHT, height: HOUR_HEIGHT }} />)}
                {isToday(day) && showNow && <div className="absolute left-0 right-0 z-10 flex items-center" style={{ top: (currentDecimal - HOUR_START) * HOUR_HEIGHT }}><span className="-ml-1 h-2 w-2 rounded-full bg-[#F07845]" /><span className="h-px flex-1 bg-[#F07845]" /></div>}
                {events.filter((event) => event.day === dayIndex).map((event) => <button key={event.id} className="absolute left-1 right-1 z-[5] overflow-hidden rounded-xl bg-[#A65B32] p-2 text-left text-white shadow-sm transition hover:brightness-110" style={{ top: (event.start - HOUR_START) * HOUR_HEIGHT + 4, height: (event.end - event.start) * HOUR_HEIGHT - 8 }}><span className="rounded-full bg-white/20 px-2 py-0.5 text-[8px] font-bold uppercase">Presencial</span><strong className="mt-1.5 block text-[11px] leading-4">{event.course}</strong><span className="mt-1 block text-[9px] text-white/70">{formatHour(event.start)} - {formatHour(event.end)}</span><span className="mt-1 flex items-center gap-1 text-[9px] text-white/60"><MapPin size={9} />{event.room}</span></button>)}
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
