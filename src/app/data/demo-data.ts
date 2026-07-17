import type {
  Assignment,
  Course,
  CourseResource,
  CourseSection,
  CourseWeek,
  Evaluation,
  EvaluationResult,
  Grade,
  ScheduleEntry,
  Section,
  Submission,
  Teacher,
} from "../types";

export const initialGrades: Grade[] = [
  { id: "g1", name: "1° Secundaria" },
  { id: "g2", name: "2° Secundaria" },
  { id: "g3", name: "3° Secundaria" },
  { id: "g4", name: "4° Secundaria" },
  { id: "g5", name: "5° Secundaria" },
];

export const initialSections: Section[] = initialGrades.map((grade, index) => ({
  id: `s${index + 1}a`,
  gradeId: grade.id,
  name: "A",
}));

export const initialTeachers: Teacher[] = [
  { id: "d1", name: "Marisol Quispe", specialty: "Matemática", initials: "MQ" },
  { id: "d2", name: "Jorge Ramos", specialty: "Comunicación", initials: "JR" },
  { id: "d3", name: "Lucía Fernández", specialty: "Ciencia y Tecnología", initials: "LF" },
  { id: "d4", name: "Bryan Torres", specialty: "Inglés", initials: "BT" },
];

export const initialCourses: Course[] = [
  { id: "c1", name: "Matemática", description: "Álgebra, geometría y razonamiento matemático.", gradeId: "g3", modality: "Presencial", color: "#F6A84B", accent: "#8A4A13", icon: "∑" },
  { id: "c2", name: "Comunicación", description: "Comprensión lectora y producción de textos.", gradeId: "g3", modality: "Presencial", color: "#EF7B73", accent: "#8F302B", icon: "Aa" },
  { id: "c3", name: "Ciencia y Tecnología", description: "Física, química y biología aplicada.", gradeId: "g3", modality: "Virtual 24/7", color: "#67B9A4", accent: "#176858", icon: "⚗" },
  { id: "c4", name: "Inglés", description: "Speaking, listening, reading and writing.", gradeId: "g3", modality: "Presencial", color: "#8299DC", accent: "#354E9A", icon: "Hi" },
];

export const initialCourseSections: CourseSection[] = [
  {
    id: "cs1", courseId: "c1", sectionId: "s3a", teacherId: "d1", code: "30001", totalWeeks: 9,
    bannerNotice: "Recuerda revisar el material antes de cada clase y traer tu cuaderno de ejercicios.",
    bibliography: "Matemática 3, Editorial Horizonte. Cuaderno de trabajo del Bimestre III.",
    generalInfo: "En este bimestre aprenderemos a representar y resolver situaciones mediante ecuaciones lineales.",
  },
  { id: "cs2", courseId: "c2", sectionId: "s3a", teacherId: "d2", code: "30002", totalWeeks: 9, bannerNotice: "Esta semana iniciaremos nuestro club de lectura." },
  { id: "cs3", courseId: "c3", sectionId: "s3a", teacherId: "d3", code: "30003", totalWeeks: 9, bannerNotice: "Laboratorio virtual disponible hasta el viernes." },
  { id: "cs4", courseId: "c4", sectionId: "s3a", teacherId: "d4", code: "30004", totalWeeks: 9 },
];

export const initialWeeks: CourseWeek[] = [
  { id: "w1", courseSectionId: "cs1", number: 1, title: "Ecuaciones y lenguaje algebraico" },
  { id: "w2", courseSectionId: "cs1", number: 2, title: "Ecuaciones lineales" },
  { id: "w3", courseSectionId: "cs1", number: 3, title: "Problemas con ecuaciones" },
  { id: "w4", courseSectionId: "cs2", number: 1, title: "El texto narrativo" },
  { id: "w5", courseSectionId: "cs3", number: 1, title: "La materia y sus cambios" },
  { id: "w6", courseSectionId: "cs4", number: 1, title: "Introducing yourself" },
];

export const initialResources: CourseResource[] = [
  { id: "r1", weekId: "w1", title: "Introducción a la semana", type: "lectura", contentText: "Conocerás cómo traducir expresiones cotidianas al lenguaje algebraico y reconocer sus elementos.", order: 1 },
  { id: "r2", weekId: "w1", title: "01 - Expresiones algebraicas", type: "video", contentText: "Video explicativo: variables, términos y coeficientes.", contentUrl: "https://www.youtube.com/embed/UNWFLuUfiX4", order: 2 },
  { id: "r3", weekId: "w1", title: "Guía de ejercicios", type: "documento", contentText: "Descarga la guía y resuelve los ejercicios propuestos.", contentUrl: "#", order: 3 },
  { id: "r4", weekId: "w2", title: "Método de transposición", type: "lectura", contentText: "Una igualdad se conserva cuando realizamos la misma operación en ambos miembros.", order: 1 },
  { id: "r5", weekId: "w3", title: "Problemas resueltos", type: "link", contentText: "Colección interactiva de problemas contextualizados.", contentUrl: "#", order: 1 },
  { id: "r6", weekId: "w4", title: "Elementos de la narración", type: "lectura", contentText: "Narrador, personajes, espacio, tiempo y acontecimientos.", order: 1 },
  { id: "r7", weekId: "w5", title: "Cambios físicos y químicos", type: "video", contentText: "Observa ejemplos de cambios de la materia en tu entorno.", order: 1 },
  { id: "r8", weekId: "w6", title: "Greetings and introductions", type: "lectura", contentText: "Useful phrases to introduce yourself and meet new people.", order: 1 },
];

export const initialAssignments: Assignment[] = [
  { id: "t1", courseSectionId: "cs1", title: "Práctica de ecuaciones lineales", dueAt: "2026-07-25T23:59:00", maxScore: 20, instructions: "Resuelve los ejercicios 1 al 10 de la guía y sube tu desarrollo en PDF.", attachmentUrl: "#" },
  { id: "t2", courseSectionId: "cs2", title: "Comentario del cuento El vuelo", dueAt: "2026-07-20T18:00:00", maxScore: 20, instructions: "Escribe un comentario de 300 palabras sobre el conflicto principal." },
  { id: "t3", courseSectionId: "cs3", title: "Informe de cambios de la materia", dueAt: "2026-07-28T20:00:00", maxScore: 20, instructions: "Registra un cambio físico y uno químico observado en casa." },
  { id: "t4", courseSectionId: "cs4", title: "My personal profile", dueAt: "2026-07-18T17:00:00", maxScore: 20, instructions: "Write a short personal profile using the vocabulary from class." },
  { id: "t5", courseSectionId: "cs1", title: "Ficha de lenguaje algebraico", dueAt: "2026-07-12T20:00:00", maxScore: 20, instructions: "Completa la ficha de la semana 1." },
];

export const initialSubmissions: Submission[] = [
  { id: "sub1", assignmentId: "t4", studentId: "student-1", status: "entregado", submittedAt: "2026-07-16T15:40:00", answer: "My name is Xamir and I am a student at Colegio Horizonte." },
  { id: "sub2", assignmentId: "t5", studentId: "student-1", status: "calificado", submittedAt: "2026-07-11T19:12:00", fileName: "ficha-algebra.pdf", score: 18 },
];

export const initialEvaluations: Evaluation[] = [
  { id: "e1", courseSectionId: "cs1", title: "Examen Bimestral - Álgebra", type: "examen", startsAt: "2026-08-01T08:00:00", endsAt: "2026-08-01T09:30:00", maxScore: 20, instructions: "Duración: 90 minutos. Lee cada pregunta antes de responder. Sin material de apoyo." },
  { id: "e2", courseSectionId: "cs2", title: "Control de comprensión lectora", type: "cuestionario", startsAt: "2026-07-22T09:00:00", endsAt: "2026-07-22T09:45:00", maxScore: 20, instructions: "Cuestionario de 12 preguntas sobre la lectura asignada." },
  { id: "e3", courseSectionId: "cs3", title: "Práctica: estados de la materia", type: "practica", startsAt: "2026-07-30T10:00:00", endsAt: "2026-07-30T11:00:00", maxScore: 20, instructions: "Práctica individual con material del aula virtual." },
  { id: "e4", courseSectionId: "cs4", title: "Vocabulary quiz", type: "cuestionario", startsAt: "2026-07-10T08:00:00", endsAt: "2026-07-10T08:30:00", maxScore: 20, instructions: "Greetings and personal information." },
];

export const initialResults: EvaluationResult[] = [
  { id: "res1", evaluationId: "e4", studentId: "student-1", status: "calificado", completedAt: "2026-07-10T08:22:00", score: 17 },
];

export const initialSchedules: ScheduleEntry[] = [
  { id: "h1", courseSectionId: "cs1", day: "Lun", startTime: "08:00", endTime: "09:30", classroom: "A0301" },
  { id: "h2", courseSectionId: "cs1", day: "Mie", startTime: "08:00", endTime: "09:30", classroom: "A0301" },
  { id: "h3", courseSectionId: "cs2", day: "Mar", startTime: "10:00", endTime: "11:30", classroom: "A0202" },
  { id: "h4", courseSectionId: "cs3", day: "Jue", startTime: "09:00", endTime: "10:30", classroom: "Lab 02" },
  { id: "h5", courseSectionId: "cs4", day: "Vie", startTime: "08:00", endTime: "09:30", classroom: "A0104" },
];
