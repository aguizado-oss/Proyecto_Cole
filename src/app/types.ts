export type UserRole = "estudiante" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  code: string;
  role: UserRole;
  sectionId?: string;
  studentId?: string;
}

export interface Grade {
  id: string;
  name: string;
}

export interface Section {
  id: string;
  gradeId: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
  specialty: string;
  initials: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  gradeId: string;
  modality: "Presencial" | "Virtual 24/7";
  color: string;
  accent: string;
  icon: string;
}

export interface CourseSection {
  id: string;
  courseId: string;
  sectionId: string;
  teacherId: string;
  code: string;
  bannerNotice?: string;
  bibliography?: string;
  generalInfo?: string;
  totalWeeks: number;
}

export interface CourseWeek {
  id: string;
  courseSectionId: string;
  number: number;
  title: string;
}

export interface CourseResource {
  id: string;
  weekId: string;
  title: string;
  type: "lectura" | "video" | "documento" | "link";
  contentText?: string;
  contentUrl?: string;
  order: number;
}

export interface Assignment {
  id: string;
  courseSectionId: string;
  title: string;
  dueAt: string;
  maxScore: number;
  instructions: string;
  attachmentUrl?: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: "pendiente" | "entregado" | "calificado";
  submittedAt?: string;
  answer?: string;
  fileName?: string;
  score?: number;
}

export interface Evaluation {
  id: string;
  courseSectionId: string;
  title: string;
  type: "examen" | "practica" | "cuestionario";
  startsAt: string;
  endsAt: string;
  maxScore: number;
  instructions: string;
}

export interface EvaluationResult {
  id: string;
  evaluationId: string;
  studentId: string;
  status: "pendiente" | "rendido" | "calificado";
  completedAt?: string;
  score?: number;
}

export interface ScheduleEntry {
  id: string;
  courseSectionId: string;
  day: "Lun" | "Mar" | "Mie" | "Jue" | "Vie" | "Sab" | "Dom";
  startTime: string;
  endTime: string;
  classroom: string;
}
