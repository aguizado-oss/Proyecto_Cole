import { useMemo } from "react";
import { useNavigate } from "react-router";
import { ArrowUpRight, BookCheck, CheckCircle2, ClipboardCheck, Clock3, FileQuestion, Video } from "lucide-react";
import { useAcademicData } from "../../context/AcademicDataContext";
import type { SessionUser } from "../../types";

const formatDateTime = (value: string) => new Intl.DateTimeFormat("es-PE", {
  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
}).format(new Date(value));

const stateStyle = {
  pendiente: "bg-amber-50 text-amber-700 border-amber-200",
  entregado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  calificado: "bg-slate-100 text-slate-600 border-slate-200",
};

export function CoursesPage({ user }: { user: SessionUser }) {
  const data = useAcademicData();
  const navigate = useNavigate();
  const visibleSections = data.courseSections.filter((item) => user.role === "admin" || item.sectionId === user.sectionId);

  const pending = useMemo(() => {
    const sectionIds = new Set(visibleSections.map((item) => item.id));
    const taskItems = data.assignments.filter((item) => sectionIds.has(item.courseSectionId)).map((task) => {
      const submission = data.submissions.find((item) => item.assignmentId === task.id && item.studentId === user.studentId);
      const cs = data.courseSections.find((item) => item.id === task.courseSectionId)!;
      const course = data.courses.find((item) => item.id === cs.courseId)!;
      const status = submission?.status ?? "pendiente";
      return { id: task.id, courseId: course.id, tab: "Tareas", type: status === "calificado" ? "Tarea calificada" : "Tarea no calificada", title: task.title, course: course.name, dueAt: task.dueAt, status, score: status === "calificado" ? submission?.score : task.maxScore, icon: status === "calificado" ? CheckCircle2 : ClipboardCheck };
    });
    const evaluationItems = data.evaluations.filter((item) => sectionIds.has(item.courseSectionId)).map((evaluation) => {
      const result = data.results.find((item) => item.evaluationId === evaluation.id && item.studentId === user.studentId);
      const cs = data.courseSections.find((item) => item.id === evaluation.courseSectionId)!;
      const course = data.courses.find((item) => item.id === cs.courseId)!;
      return { id: evaluation.id, courseId: course.id, tab: "Evaluaciones", type: "Evaluación no calificada", title: evaluation.title, course: course.name, dueAt: evaluation.endsAt, status: result?.status === "calificado" ? "calificado" as const : "pendiente" as const, score: result?.score ?? evaluation.maxScore, icon: FileQuestion };
    });
    return [...taskItems, ...evaluationItems].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  }, [data, user.studentId, visibleSections]);

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#E76F3C]">Bimestre III · 3° Secundaria A</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#19345D]">Mis cursos</h1><p className="mt-1 text-sm text-slate-500">Continúa aprendiendo y revisa tus próximas entregas.</p></div>
        <div className="rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm">{visibleSections.length} cursos publicados</div>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {visibleSections.map((courseSection) => {
            const course = data.courses.find((item) => item.id === courseSection.courseId)!;
            const teacher = data.teachers.find((item) => item.id === courseSection.teacherId)!;
            const tasks = data.assignments.filter((item) => item.courseSectionId === courseSection.id);
            const evaluations = data.evaluations.filter((item) => item.courseSectionId === courseSection.id);
            const doneTasks = tasks.filter((task) => data.submissions.some((submission) => submission.assignmentId === task.id && submission.studentId === user.studentId && submission.status !== "pendiente")).length;
            const doneEvaluations = evaluations.filter((evaluation) => data.results.some((result) => result.evaluationId === evaluation.id && result.studentId === user.studentId && result.status !== "pendiente")).length;
            const total = tasks.length + evaluations.length;
            const progress = total ? Math.round(((doneTasks + doneEvaluations) / total) * 100) : 0;
            return (
              <button key={courseSection.id} onClick={() => navigate(`/cursos/${course.id}`)} className="group overflow-hidden rounded-[22px] border border-black/5 bg-white text-left shadow-[0_5px_24px_rgba(25,52,93,.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(25,52,93,.12)]">
                <div className="relative h-36 overflow-hidden p-5" style={{ backgroundColor: course.color }}>
                  <div className="absolute -bottom-14 -right-8 h-40 w-40 rounded-full border-[28px] border-white/15" />
                  <div className="absolute -right-2 top-3 rotate-12 text-7xl font-black text-white/18">{course.icon}</div>
                  <div className="relative flex items-start justify-between">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold" style={{ color: course.accent }}>{progress}% completado</span>
                    <ArrowUpRight className="text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={20} />
                  </div>
                  <div className="absolute bottom-5 left-5 h-1.5 w-[calc(100%-40px)] overflow-hidden rounded-full bg-white/30"><span className="block h-full rounded-full bg-white" style={{ width: `${progress}%` }} /></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><span>Sección {courseSection.code}</span><span>·</span>{course.modality === "Virtual 24/7" && <Video size={12} />}<span>{course.modality}</span></div>
                  <h2 className="mt-2 min-h-12 text-lg font-extrabold leading-6 text-[#19345D]">{course.name}</h2>
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4"><span className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: course.accent }}>{teacher.initials}</span><span><span className="block text-[10px] text-slate-400">Docente</span><span className="block text-xs font-semibold text-[#19345D]">{teacher.name}</span></span></div>
                </div>
              </button>
            );
          })}
        </section>

        <aside className="overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_5px_24px_rgba(25,52,93,.06)] xl:sticky xl:top-6">
          <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-extrabold text-[#19345D]">Pendientes</h2><p className="mt-0.5 text-[11px] text-slate-400">Todos tus cursos, por fecha</p></div><span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#FFF0E1] px-2 text-xs font-bold text-[#A9571C]">{pending.length}</span></div>
          <div className="max-h-[660px] divide-y divide-slate-100 overflow-y-auto">
            {pending.map((item) => {
              const Icon = item.icon;
              const statusLabel = item.status === "pendiente" ? "Por entregar" : item.status === "entregado" ? "Entregado" : "Calificado";
              return (
                <button key={`${item.type}-${item.id}`} onClick={() => navigate(`/cursos/${item.courseId}?tab=${encodeURIComponent(item.tab)}`)} className="flex w-full gap-3 p-4 text-left transition-colors hover:bg-[#FFFCF8]">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F4FA] text-[#4D62A3]"><Icon size={17} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{item.type}</span><span className="mt-1 block text-xs font-bold leading-5 text-[#19345D]">{item.title}</span><span className="mt-1 block text-[10px] font-medium text-[#287665]">{item.course}</span><span className="mt-2 flex items-center gap-1 text-[10px] text-slate-400"><Clock3 size={11} /> Vence: {formatDateTime(item.dueAt)}</span><span className="mt-2 flex flex-wrap items-center gap-2"><span className={`rounded-full border px-2 py-1 text-[9px] font-bold ${stateStyle[item.status]}`}>{statusLabel}</span><span className="text-[10px] font-bold text-slate-500">{item.score} pts</span></span></span>
                </button>
              );
            })}
          </div>
          {pending.length === 0 && <div className="p-10 text-center"><BookCheck className="mx-auto text-emerald-500" /><p className="mt-3 text-sm font-semibold">Todo al día</p></div>}
        </aside>
      </div>
    </div>
  );
}
