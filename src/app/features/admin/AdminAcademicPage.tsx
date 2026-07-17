import { useState, type FormEvent, type ReactNode } from "react";
import { BookOpen, CalendarClock, ClipboardList, GraduationCap, Layers3, Pencil, Plus, Settings2 } from "lucide-react";
import { useAcademicData } from "../../context/AcademicDataContext";

const tabs = [
  { id: "estructura", label: "Grados y secciones", icon: GraduationCap },
  { id: "cursos", label: "Cursos", icon: BookOpen },
  { id: "horarios", label: "Horarios", icon: CalendarClock },
  { id: "contenido", label: "Contenido", icon: Layers3 },
  { id: "actividades", label: "Evaluaciones y tareas", icon: ClipboardList },
];

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-[#19345D] outline-none focus:border-[#F07845] focus:ring-4 focus:ring-[#F07845]/10";
const labelClass = "block text-[10px] font-bold uppercase tracking-wider text-slate-500";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className={labelClass}>{label}<span className="mt-2 block">{children}</span></label>;
}

function SubmitButton({ children }: { children: ReactNode }) {
  return <button className="flex items-center justify-center gap-2 rounded-xl bg-[#19345D] px-4 py-3 text-xs font-semibold text-white hover:bg-[#102641]"><Plus size={14} />{children}</button>;
}

export function AdminAcademicPage() {
  const data = useAcademicData();
  const [activeTab, setActiveTab] = useState("estructura");
  const [message, setMessage] = useState("");

  const success = (text: string, form?: HTMLFormElement) => {
    form?.reset();
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };
  const courseName = (courseSectionId: string) => {
    const courseSection = data.courseSections.find((item) => item.id === courseSectionId);
    return data.courses.find((item) => item.id === courseSection?.courseId)?.name ?? "Curso";
  };

  const createGrade = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const name = String(new FormData(form).get("name") ?? "").trim();
    if (name) { data.addGrade(name); success("Grado creado correctamente.", form); }
  };
  const createSection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form); const name = String(values.get("name") ?? "").trim();
    if (name) { data.addSection(String(values.get("gradeId")), name.toUpperCase()); success("Sección creada correctamente.", form); }
  };
  const createCourse = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form); const sectionId = String(values.get("sectionId")); const section = data.sections.find((item) => item.id === sectionId); if (!section) return;
    data.publishCourse({ name: String(values.get("name")), description: String(values.get("description")), gradeId: section.gradeId, modality: String(values.get("modality")) as "Presencial" | "Virtual 24/7" }, sectionId, String(values.get("teacherId")), String(values.get("code")));
    success("Curso publicado para toda la sección.", form);
  };
  const createSchedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form);
    data.addSchedule({ courseSectionId: String(values.get("courseSectionId")), day: String(values.get("day")) as "Lun", startTime: String(values.get("startTime")), endTime: String(values.get("endTime")), classroom: String(values.get("classroom")) }); success("Horario agregado.", form);
  };
  const createWeek = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form);
    data.addWeek({ courseSectionId: String(values.get("courseSectionId")), number: Number(values.get("number")), title: String(values.get("title")) }); success("Semana creada.", form);
  };
  const createResource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form);
    data.addResource({ weekId: String(values.get("weekId")), title: String(values.get("title")), type: String(values.get("type")) as "lectura", contentText: String(values.get("contentText")), contentUrl: String(values.get("contentUrl")) || undefined, order: Number(values.get("order")) }); success("Recurso publicado.", form);
  };
  const createAssignment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form);
    data.addAssignment({ courseSectionId: String(values.get("courseSectionId")), title: String(values.get("title")), dueAt: String(values.get("dueAt")), maxScore: Number(values.get("maxScore")), instructions: String(values.get("instructions")) }); success("Tarea publicada.", form);
  };
  const createEvaluation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const values = new FormData(form);
    data.addEvaluation({ courseSectionId: String(values.get("courseSectionId")), title: String(values.get("title")), type: String(values.get("type")) as "examen", startsAt: String(values.get("startsAt")), endsAt: String(values.get("endsAt")), maxScore: Number(values.get("maxScore")), instructions: String(values.get("instructions")) }); success("Evaluación publicada.", form);
  };

  return (
    <div className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#287665]"><Settings2 size={14} /> Gestión escolar</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#19345D]">Administración académica</h1><p className="mt-1 text-sm text-slate-500">Configura una vez y publica para todos los alumnos de una sección.</p></div><span className="rounded-full bg-[#EAF5F1] px-4 py-2 text-xs font-bold text-[#287665]">Acceso admin</span></div>
      {message && <div className="fixed right-5 top-20 z-50 rounded-xl bg-[#287665] px-5 py-3 text-xs font-semibold text-white shadow-xl">{message}</div>}

      <div className="mt-7 overflow-x-auto"><div className="flex min-w-max gap-2">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${activeTab === id ? "bg-[#19345D] text-white" : "border border-black/5 bg-white text-slate-500 hover:text-[#19345D]"}`}><Icon size={15} />{label}</button>)}</div></div>

      {activeTab === "estructura" && <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <AdminCard title="Grados" subtitle="Niveles académicos disponibles">
          <form onSubmit={createGrade} className="flex gap-2"><input name="name" required className={inputClass} placeholder="Ej. 6° Primaria" /><SubmitButton>Crear</SubmitButton></form>
          <div className="mt-5 divide-y divide-slate-100">{data.grades.map((grade) => <div key={grade.id} className="flex items-center justify-between py-3"><span className="text-xs font-semibold text-[#19345D]">{grade.name}</span><button onClick={() => { const name = window.prompt("Nombre del grado", grade.name); if (name?.trim()) data.updateGrade(grade.id, name.trim()); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#19345D]" aria-label="Editar grado"><Pencil size={14} /></button></div>)}</div>
        </AdminCard>
        <AdminCard title="Secciones" subtitle="Cada sección pertenece a un grado">
          <form onSubmit={createSection} className="grid grid-cols-[1fr_90px_auto] gap-2"><select name="gradeId" className={inputClass}>{data.grades.map((grade) => <option key={grade.id} value={grade.id}>{grade.name}</option>)}</select><input name="name" maxLength={5} required className={inputClass} placeholder="A" /><SubmitButton>Crear</SubmitButton></form>
          <div className="mt-5 divide-y divide-slate-100">{data.sections.map((section) => <div key={section.id} className="flex items-center justify-between py-3"><span className="text-xs font-semibold text-[#19345D]">{data.grades.find((grade) => grade.id === section.gradeId)?.name} - {section.name}</span><button onClick={() => { const name = window.prompt("Nombre de la sección", section.name); if (name?.trim()) data.updateSection(section.id, name.trim().toUpperCase()); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><Pencil size={14} /></button></div>)}</div>
        </AdminCard>
      </div>}

      {activeTab === "cursos" && <div className="mt-6 grid gap-5 xl:grid-cols-[420px_1fr]"><AdminCard title="Publicar un curso" subtitle="Se asignará a todos los alumnos de la sección"><form onSubmit={createCourse} className="space-y-4"><Field label="Nombre"><input name="name" required className={inputClass} placeholder="Ej. Historia" /></Field><Field label="Descripción"><textarea name="description" required rows={3} className={inputClass} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Grado y sección"><select name="sectionId" className={inputClass}>{data.sections.map((section) => <option key={section.id} value={section.id}>{data.grades.find((grade) => grade.id === section.gradeId)?.name} - {section.name}</option>)}</select></Field><Field label="Docente"><select name="teacherId" className={inputClass}>{data.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}</select></Field></div><div className="grid grid-cols-2 gap-3"><Field label="Código"><input name="code" required className={inputClass} placeholder="30005" /></Field><Field label="Modalidad"><select name="modality" className={inputClass}><option>Presencial</option><option>Virtual 24/7</option></select></Field></div><SubmitButton>Publicar curso</SubmitButton></form></AdminCard><AdminCard title="Cursos publicados" subtitle={`${data.courseSections.length} asignaciones activas`}><div className="grid gap-3 sm:grid-cols-2">{data.courseSections.map((courseSection) => { const course = data.courses.find((item) => item.id === courseSection.courseId)!; const section = data.sections.find((item) => item.id === courseSection.sectionId)!; return <div key={courseSection.id} className="rounded-xl border border-slate-100 p-4"><div className="h-2 w-10 rounded-full" style={{ backgroundColor: course.color }} /><h3 className="mt-3 text-sm font-bold text-[#19345D]">{course.name}</h3><p className="mt-1 text-[10px] text-slate-400">{data.grades.find((grade) => grade.id === section.gradeId)?.name} - {section.name} · {courseSection.code}</p><p className="mt-2 text-[10px] font-semibold text-[#287665]">{data.teachers.find((teacher) => teacher.id === courseSection.teacherId)?.name}</p></div>; })}</div></AdminCard></div>}

      {activeTab === "horarios" && <div className="mt-6 grid gap-5 lg:grid-cols-[420px_1fr]"><AdminCard title="Agregar horario" subtitle="Bloque semanal de un curso-sección"><form onSubmit={createSchedule} className="space-y-4"><CourseSectionSelect data={data} /><div className="grid grid-cols-3 gap-3"><Field label="Día"><select name="day" className={inputClass}>{["Lun","Mar","Mie","Jue","Vie","Sab","Dom"].map((day) => <option key={day}>{day}</option>)}</select></Field><Field label="Inicio"><input name="startTime" type="time" required className={inputClass} /></Field><Field label="Fin"><input name="endTime" type="time" required className={inputClass} /></Field></div><Field label="Aula"><input name="classroom" required className={inputClass} placeholder="A0301" /></Field><SubmitButton>Agregar bloque</SubmitButton></form></AdminCard><AdminCard title="Horario publicado" subtitle="Bloques configurados"><div className="divide-y divide-slate-100">{data.schedules.map((entry) => <div key={entry.id} className="grid grid-cols-[55px_1fr_auto] items-center gap-3 py-3 text-xs"><strong className="text-[#E76F3C]">{entry.day}</strong><span className="font-semibold text-[#19345D]">{courseName(entry.courseSectionId)} <small className="block font-normal text-slate-400">{entry.classroom}</small></span><span className="text-slate-500">{entry.startTime} - {entry.endTime}</span></div>)}</div></AdminCard></div>}

      {activeTab === "contenido" && <div className="mt-6 grid gap-5 lg:grid-cols-2"><AdminCard title="Crear semana" subtitle="Organiza el contenido del curso"><form onSubmit={createWeek} className="space-y-4"><CourseSectionSelect data={data} /><div className="grid grid-cols-[100px_1fr] gap-3"><Field label="Número"><input name="number" type="number" min="1" required className={inputClass} /></Field><Field label="Título"><input name="title" required className={inputClass} placeholder="Ecuaciones lineales" /></Field></div><SubmitButton>Crear semana</SubmitButton></form></AdminCard><AdminCard title="Publicar recurso" subtitle="Lectura, video, documento o enlace"><form onSubmit={createResource} className="space-y-4"><Field label="Semana"><select name="weekId" className={inputClass}>{data.weeks.map((week) => <option key={week.id} value={week.id}>{courseName(week.courseSectionId)} · Semana {week.number}</option>)}</select></Field><div className="grid grid-cols-[1fr_130px_80px] gap-3"><Field label="Título"><input name="title" required className={inputClass} /></Field><Field label="Tipo"><select name="type" className={inputClass}><option>lectura</option><option>video</option><option>documento</option><option>link</option></select></Field><Field label="Orden"><input name="order" type="number" defaultValue="1" className={inputClass} /></Field></div><Field label="Contenido"><textarea name="contentText" required rows={3} className={inputClass} /></Field><Field label="URL opcional"><input name="contentUrl" type="url" className={inputClass} placeholder="https://..." /></Field><SubmitButton>Publicar recurso</SubmitButton></form></AdminCard></div>}

      {activeTab === "actividades" && <div className="mt-6 grid gap-5 lg:grid-cols-2"><AdminCard title="Crear tarea" subtitle="Actividad con fecha límite y puntaje"><form onSubmit={createAssignment} className="space-y-4"><CourseSectionSelect data={data} /><Field label="Título"><input name="title" required className={inputClass} /></Field><div className="grid grid-cols-[1fr_120px] gap-3"><Field label="Fecha de entrega"><input name="dueAt" type="datetime-local" required className={inputClass} /></Field><Field label="Puntaje"><input name="maxScore" type="number" min="1" defaultValue="20" required className={inputClass} /></Field></div><Field label="Instrucciones"><textarea name="instructions" required rows={4} className={inputClass} /></Field><SubmitButton>Publicar tarea</SubmitButton></form></AdminCard><AdminCard title="Crear evaluación" subtitle="Examen, práctica o cuestionario"><form onSubmit={createEvaluation} className="space-y-4"><CourseSectionSelect data={data} /><div className="grid grid-cols-[1fr_140px] gap-3"><Field label="Título"><input name="title" required className={inputClass} /></Field><Field label="Tipo"><select name="type" className={inputClass}><option value="examen">Examen</option><option value="practica">Práctica</option><option value="cuestionario">Cuestionario</option></select></Field></div><div className="grid grid-cols-2 gap-3"><Field label="Disponible desde"><input name="startsAt" type="datetime-local" required className={inputClass} /></Field><Field label="Cierra"><input name="endsAt" type="datetime-local" required className={inputClass} /></Field></div><Field label="Puntaje máximo"><input name="maxScore" type="number" min="1" defaultValue="20" required className={inputClass} /></Field><Field label="Instrucciones"><textarea name="instructions" required rows={3} className={inputClass} /></Field><SubmitButton>Publicar evaluación</SubmitButton></form></AdminCard></div>}
    </div>
  );
}

function AdminCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) { return <section className="rounded-[22px] border border-black/5 bg-white p-5 shadow-[0_5px_24px_rgba(25,52,93,.05)] sm:p-6"><h2 className="text-base font-extrabold text-[#19345D]">{title}</h2><p className="mt-1 text-[11px] text-slate-400">{subtitle}</p><div className="mt-5">{children}</div></section>; }
function CourseSectionSelect({ data }: { data: ReturnType<typeof useAcademicData> }) { return <Field label="Curso y sección"><select name="courseSectionId" className={inputClass}>{data.courseSections.map((courseSection) => { const section = data.sections.find((item) => item.id === courseSection.sectionId); return <option key={courseSection.id} value={courseSection.id}>{data.courses.find((course) => course.id === courseSection.courseId)?.name} · {data.grades.find((grade) => grade.id === section?.gradeId)?.name} {section?.name}</option>; })}</select></Field>; }
