import { useState, type FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, BookMarked, CheckCircle2, ChevronDown, CircleAlert, Clock3, Download, ExternalLink, FileText, Link2, ListChecks, Megaphone, MonitorPlay, NotebookTabs, Paperclip, PlayCircle, Send, Upload, Video } from "lucide-react";
import { useAcademicData } from "../../context/AcademicDataContext";
import type { Assignment, SessionUser } from "../../types";

const tabs = ["Sílabo", "Contenido", "Evaluaciones", "Tareas", "Foros", "Notas", "Anuncios", "Zoom"];
const formatDateTime = (value: string) => new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

function ResourceIcon({ type }: { type: string }) {
  const icons = { lectura: FileText, video: PlayCircle, documento: Download, link: Link2 };
  const Icon = icons[type as keyof typeof icons] ?? FileText;
  return <Icon size={16} />;
}

export function CourseDetailPage({ user }: { user: SessionUser }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const data = useAcademicData();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabs.includes(requestedTab ?? "") ? requestedTab! : "Contenido");
  const [selectedTask, setSelectedTask] = useState<Assignment | null>(null);
  const [answer, setAnswer] = useState("");
  const [fileName, setFileName] = useState("");
  const course = data.courses.find((item) => item.id === courseId);
  const courseSection = data.courseSections.find((item) => item.courseId === courseId && (user.role === "admin" || item.sectionId === user.sectionId));

  if (!course || !courseSection) return <div className="p-10 text-center"><CircleAlert className="mx-auto text-amber-500" /><h1 className="mt-4 text-xl font-bold">Curso no disponible</h1><button onClick={() => navigate("/cursos")} className="mt-4 text-sm font-semibold text-[#E76F3C]">Volver a cursos</button></div>;

  const teacher = data.teachers.find((item) => item.id === courseSection.teacherId)!;
  const weeks = data.weeks.filter((item) => item.courseSectionId === courseSection.id).sort((a, b) => a.number - b.number);
  const evaluations = data.evaluations.filter((item) => item.courseSectionId === courseSection.id);
  const assignments = data.assignments.filter((item) => item.courseSectionId === courseSection.id);

  const submitTask = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedTask || !user.studentId || (!answer.trim() && !fileName)) return;
    data.submitAssignment(selectedTask.id, user.studentId, answer.trim(), fileName || undefined);
    setSelectedTask(null); setAnswer(""); setFileName("");
  };

  return (
    <div className="min-h-full">
      <section className="relative overflow-hidden px-4 py-7 text-white sm:px-7 lg:px-9 lg:py-9" style={{ backgroundColor: course.accent }}>
        <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full border-[50px] border-white/10" />
        <div className="relative mx-auto max-w-[1450px]">
          <button onClick={() => navigate("/cursos")} className="mb-5 flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white"><ArrowLeft size={15} /> Volver a mis cursos</button>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Sección {courseSection.code}</span><span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold" style={{ color: course.accent }}>{course.modality}</span></div><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{course.name}</h1><p className="mt-2 max-w-2xl text-sm text-white/65">{course.description}</p></div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 pr-5 backdrop-blur"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold" style={{ color: course.accent }}>{teacher.initials}</span><span><span className="block text-[9px] uppercase tracking-wider text-white/50">Docente</span><span className="block text-xs font-semibold">{teacher.name}</span></span></div>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 overflow-x-auto border-b border-black/5 bg-white px-4 sm:px-7 lg:px-9">
        <div className="mx-auto flex min-w-max max-w-[1450px]">
          {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`relative px-4 py-4 text-xs font-semibold transition-colors ${activeTab === tab ? "text-[#E76F3C]" : "text-slate-400 hover:text-[#19345D]"}`}>{tab}{activeTab === tab && <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#F07845]" />}</button>)}
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-7 lg:py-8">
        {activeTab === "Contenido" && (
          <div className="space-y-5">
            {courseSection.bannerNotice && <div className="flex gap-3 rounded-2xl border border-[#F2D3B8] bg-[#FFF8EF] p-4 text-sm text-[#824515]"><Megaphone className="mt-0.5 shrink-0" size={18} /><div><p className="text-xs font-bold">Aviso del curso</p><p className="mt-1 text-xs leading-5 opacity-80">{courseSection.bannerNotice}</p></div></div>}
            <details className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between p-5"><span className="flex items-center gap-3 text-sm font-bold text-[#19345D]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF1FB] text-[#4D62A3]"><BookMarked size={18} /></span>Información del curso</span><ChevronDown className="text-slate-400 transition group-open:rotate-180" size={18} /></summary>
              <div className="space-y-3 border-t border-slate-100 p-4 sm:p-5">
                <details className="rounded-xl bg-[#F8F9FB] p-4"><summary className="cursor-pointer text-xs font-bold text-[#19345D]">Bibliografía</summary><p className="mt-3 text-xs leading-6 text-slate-500">{courseSection.bibliography ?? "La bibliografía será publicada por el docente."}</p></details>
                <details className="rounded-xl bg-[#F8F9FB] p-4"><summary className="cursor-pointer text-xs font-bold text-[#19345D]">Información general para el curso</summary><p className="mt-3 whitespace-pre-line text-xs leading-6 text-slate-500">{courseSection.generalInfo ?? course.description}</p></details>
              </div>
            </details>
            <div className="flex items-center justify-between pt-2"><div><h2 className="text-lg font-extrabold text-[#19345D]">Total de semanas ({courseSection.totalWeeks})</h2><p className="mt-1 text-xs text-slate-400">Material organizado por semana de aprendizaje</p></div><NotebookTabs className="text-[#E76F3C]" size={22} /></div>
            {weeks.map((week) => {
              const resources = data.resources.filter((item) => item.weekId === week.id).sort((a, b) => a.order - b.order);
              return <details key={week.id} className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between p-5"><span><span className="block text-[10px] font-bold uppercase tracking-wider text-[#E76F3C]">Semana {String(week.number).padStart(2, "0")}</span><span className="mt-1 block text-sm font-bold text-[#19345D]">{week.title}</span></span><ChevronDown className="text-slate-400 transition group-open:rotate-180" size={18} /></summary><div className="space-y-2 border-t border-slate-100 p-3 sm:p-4">{resources.map((resource) => <details key={resource.id} className="group/resource rounded-xl border border-slate-100 bg-[#FAFAF9]"><summary className="flex cursor-pointer list-none items-center justify-between p-4"><span className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#287665] shadow-sm"><ResourceIcon type={resource.type} /></span><span><span className="block text-xs font-semibold text-[#19345D]">{resource.title}</span><span className="mt-0.5 block text-[9px] uppercase tracking-wider text-slate-400">{resource.type}</span></span></span><ChevronDown size={15} className="text-slate-400 transition group-open/resource:rotate-180" /></summary><div className="border-t border-slate-100 p-4 text-xs leading-6 text-slate-600">{resource.type === "video" && resource.contentUrl && resource.contentUrl !== "#" && <div className="mb-4 aspect-video overflow-hidden rounded-xl bg-slate-900"><iframe src={resource.contentUrl} title={resource.title} className="h-full w-full" allowFullScreen /></div>}<p>{resource.contentText}</p>{resource.contentUrl && resource.type !== "video" && <a href={resource.contentUrl} className="mt-3 inline-flex items-center gap-2 font-semibold text-[#E76F3C]">Abrir recurso <ExternalLink size={13} /></a>}</div></details>)}</div></details>;
            })}
            {weeks.length === 0 && <EmptyState icon={MonitorPlay} text="El docente aún no ha publicado contenido." />}
          </div>
        )}

        {activeTab === "Evaluaciones" && <div className="space-y-3"><SectionHeading icon={ListChecks} title="Evaluaciones" subtitle="Exámenes, prácticas y cuestionarios del curso" />{evaluations.map((evaluation) => { const result = data.results.find((item) => item.evaluationId === evaluation.id && item.studentId === user.studentId); const status = result?.status === "calificado" ? "Calificado" : result?.status === "rendido" ? "Rendido" : "Por rendir"; const duration = Math.round((new Date(evaluation.endsAt).getTime() - new Date(evaluation.startsAt).getTime()) / 60000); return <details key={evaluation.id} className="group rounded-2xl border border-black/5 bg-white shadow-sm"><summary className="grid cursor-pointer list-none gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center"><span><span className="text-[9px] font-bold uppercase tracking-wider text-[#287665]">{evaluation.type}</span><span className="mt-1 block text-sm font-bold text-[#19345D]">{evaluation.title}</span><span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400"><span>Disponible: {formatDateTime(evaluation.startsAt)}</span><span>Cierre: {formatDateTime(evaluation.endsAt)}</span><span>{duration} min</span></span></span><span className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-[10px] font-bold ${status === "Calificado" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"}`}>{status}</span><strong className="text-xs text-[#19345D]">{result?.score ?? "—"}/{evaluation.maxScore}</strong><ChevronDown size={16} className="text-slate-400 transition group-open:rotate-180" /></span></summary><div className="border-t border-slate-100 p-5 text-xs leading-6 text-slate-500"><p className="font-semibold text-[#19345D]">Instrucciones</p><p className="mt-1">{evaluation.instructions}</p>{status === "Por rendir" && <button className="mt-4 rounded-xl bg-[#19345D] px-4 py-2.5 text-xs font-semibold text-white">Ver evaluación</button>}</div></details>; })}{evaluations.length === 0 && <EmptyState icon={ListChecks} text="No hay evaluaciones publicadas." />}</div>}

        {activeTab === "Tareas" && <div className="space-y-3"><SectionHeading icon={ClipboardCheck} title="Tareas" subtitle="Entregas, instrucciones y calificaciones" />{assignments.map((assignment) => { const submission = data.submissions.find((item) => item.assignmentId === assignment.id && item.studentId === user.studentId); const status = submission?.status ?? "pendiente"; return <div key={assignment.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><span className="text-[9px] font-bold uppercase tracking-wider text-[#E76F3C]">Tarea</span><h3 className="mt-1 text-sm font-bold text-[#19345D]">{assignment.title}</h3><p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400"><Clock3 size={12} /> Entrega: {formatDateTime(assignment.dueAt)}</p></div><div className="text-right"><span className={`rounded-full px-3 py-1 text-[10px] font-bold ${status === "pendiente" ? "bg-amber-50 text-amber-700" : status === "entregado" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{status === "pendiente" ? "Por entregar" : status === "entregado" ? "Entregado" : "Calificado"}</span><p className="mt-2 text-xs font-bold text-[#19345D]">{submission?.score ?? "—"}/{assignment.maxScore} pts</p></div></div><div className="mt-4 rounded-xl bg-[#F8F9FB] p-4 text-xs leading-6 text-slate-500"><p className="font-semibold text-[#19345D]">Instrucciones</p><p>{assignment.instructions}</p>{assignment.attachmentUrl && <a href={assignment.attachmentUrl} className="mt-2 inline-flex items-center gap-1.5 font-semibold text-[#E76F3C]"><Paperclip size={13} /> Descargar adjunto</a>}</div>{status !== "calificado" && <button onClick={() => { setSelectedTask(assignment); setAnswer(submission?.answer ?? ""); setFileName(submission?.fileName ?? ""); }} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#19345D] px-4 py-2.5 text-xs font-semibold text-white"><Upload size={14} />{status === "entregado" ? "Actualizar entrega" : "Entregar tarea"}</button>}{submission?.submittedAt && <p className="mt-3 text-[10px] text-slate-400">Última entrega: {formatDateTime(submission.submittedAt)} {submission.fileName && `· ${submission.fileName}`}</p>}</div>; })}{assignments.length === 0 && <EmptyState icon={ClipboardCheck} text="No hay tareas publicadas." />}</div>}

        {!['Contenido', 'Evaluaciones', 'Tareas'].includes(activeTab) && <EmptyState icon={activeTab === "Zoom" ? Video : BookMarked} text={`${activeTab} estará disponible próximamente.`} />}
      </div>

      {selectedTask && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#14233A]/55 p-0 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedTask(null); }}><form onSubmit={submitTask} className="w-full max-w-lg rounded-t-[24px] bg-white p-6 shadow-2xl sm:rounded-[24px]"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#E76F3C]">Entregar tarea</p><h2 className="mt-1 text-lg font-extrabold text-[#19345D]">{selectedTask.title}</h2></div><button type="button" onClick={() => setSelectedTask(null)} className="text-sm text-slate-400">Cerrar</button></div><label className="mt-5 block text-xs font-semibold text-[#19345D]">Respuesta escrita<textarea value={answer} onChange={(event) => setAnswer(event.target.value)} rows={5} className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-3 text-xs font-normal leading-5 outline-none focus:border-[#F07845]" placeholder="Escribe aquí tu respuesta..." /></label><label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-4 text-xs text-slate-500 hover:border-[#F07845]"><Upload size={18} /><span>{fileName || "Seleccionar un archivo"}</span><input type="file" className="hidden" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /></label><p className="mt-2 text-[10px] text-slate-400">Debes escribir una respuesta o seleccionar un archivo.</p><button disabled={!answer.trim() && !fileName} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F07845] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Send size={15} /> Marcar como entregado</button></form></div>}
    </div>
  );
}

function SectionHeading({ icon: Icon, title, subtitle }: { icon: typeof ListChecks; title: string; subtitle: string }) { return <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E1] text-[#E76F3C]"><Icon size={19} /></span><span><h2 className="text-lg font-extrabold text-[#19345D]">{title}</h2><p className="text-[11px] text-slate-400">{subtitle}</p></span></div>; }
function EmptyState({ icon: Icon, text }: { icon: typeof BookMarked; text: string }) { return <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center"><Icon className="mx-auto text-slate-300" size={28} /><p className="mt-3 text-sm font-semibold text-slate-500">{text}</p></div>; }
