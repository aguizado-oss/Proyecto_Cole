import { createContext, useContext, useState, type ReactNode } from "react";
import {
  initialAssignments,
  initialCourses,
  initialCourseSections,
  initialEvaluations,
  initialGrades,
  initialResources,
  initialResults,
  initialSchedules,
  initialSections,
  initialSubmissions,
  initialTeachers,
  initialWeeks,
} from "../data/demo-data";
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

interface AcademicDataValue {
  grades: Grade[];
  sections: Section[];
  teachers: Teacher[];
  courses: Course[];
  courseSections: CourseSection[];
  weeks: CourseWeek[];
  resources: CourseResource[];
  assignments: Assignment[];
  submissions: Submission[];
  evaluations: Evaluation[];
  results: EvaluationResult[];
  schedules: ScheduleEntry[];
  addGrade: (name: string) => void;
  updateGrade: (id: string, name: string) => void;
  addSection: (gradeId: string, name: string) => void;
  updateSection: (id: string, name: string) => void;
  publishCourse: (course: Omit<Course, "id" | "color" | "accent" | "icon">, sectionId: string, teacherId: string, code: string) => void;
  addSchedule: (entry: Omit<ScheduleEntry, "id">) => void;
  addWeek: (week: Omit<CourseWeek, "id">) => void;
  addResource: (resource: Omit<CourseResource, "id">) => void;
  addAssignment: (assignment: Omit<Assignment, "id">) => void;
  addEvaluation: (evaluation: Omit<Evaluation, "id">) => void;
  submitAssignment: (assignmentId: string, studentId: string, answer: string, fileName?: string) => void;
}

const AcademicDataContext = createContext<AcademicDataValue | null>(null);

const palette = [
  ["#E9A15B", "#81430F"],
  ["#E87D72", "#8E312C"],
  ["#6DB8A5", "#176858"],
  ["#8299DC", "#354E9A"],
];

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function AcademicDataProvider({ children }: { children: ReactNode }) {
  const [grades, setGrades] = useState(initialGrades);
  const [sections, setSections] = useState(initialSections);
  const [courses, setCourses] = useState(initialCourses);
  const [courseSections, setCourseSections] = useState(initialCourseSections);
  const [weeks, setWeeks] = useState(initialWeeks);
  const [resources, setResources] = useState(initialResources);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [evaluations, setEvaluations] = useState(initialEvaluations);
  const [schedules, setSchedules] = useState(initialSchedules);

  const addGrade = (name: string) => setGrades((items) => [...items, { id: makeId("grade"), name }]);
  const updateGrade = (id: string, name: string) => setGrades((items) => items.map((item) => item.id === id ? { ...item, name } : item));
  const addSection = (gradeId: string, name: string) => setSections((items) => [...items, { id: makeId("section"), gradeId, name }]);
  const updateSection = (id: string, name: string) => setSections((items) => items.map((item) => item.id === id ? { ...item, name } : item));

  const publishCourse: AcademicDataValue["publishCourse"] = (course, sectionId, teacherId, code) => {
    const id = makeId("course");
    const colorPair = palette[courses.length % palette.length];
    setCourses((items) => [...items, { ...course, id, color: colorPair[0], accent: colorPair[1], icon: course.name.slice(0, 2) }]);
    setCourseSections((items) => [...items, {
      id: makeId("course-section"), courseId: id, sectionId, teacherId, code, totalWeeks: 9,
    }]);
  };

  const addSchedule = (entry: Omit<ScheduleEntry, "id">) => setSchedules((items) => [...items, { ...entry, id: makeId("schedule") }]);
  const addWeek = (week: Omit<CourseWeek, "id">) => setWeeks((items) => [...items, { ...week, id: makeId("week") }]);
  const addResource = (resource: Omit<CourseResource, "id">) => setResources((items) => [...items, { ...resource, id: makeId("resource") }]);
  const addAssignment = (assignment: Omit<Assignment, "id">) => setAssignments((items) => [...items, { ...assignment, id: makeId("assignment") }]);
  const addEvaluation = (evaluation: Omit<Evaluation, "id">) => setEvaluations((items) => [...items, { ...evaluation, id: makeId("evaluation") }]);

  const submitAssignment = (assignmentId: string, studentId: string, answer: string, fileName?: string) => {
    setSubmissions((items) => {
      const existing = items.find((item) => item.assignmentId === assignmentId && item.studentId === studentId);
      if (existing) {
        return items.map((item) => item.id === existing.id ? {
          ...item, answer, fileName, status: "entregado", submittedAt: new Date().toISOString(), score: undefined,
        } : item);
      }
      return [...items, {
        id: makeId("submission"), assignmentId, studentId, answer, fileName,
        status: "entregado", submittedAt: new Date().toISOString(),
      }];
    });
  };

  return (
    <AcademicDataContext.Provider value={{
      grades, sections, teachers: initialTeachers, courses, courseSections, weeks, resources,
      assignments, submissions, evaluations, results: initialResults, schedules,
      addGrade, updateGrade, addSection, updateSection, publishCourse, addSchedule,
      addWeek, addResource, addAssignment, addEvaluation, submitAssignment,
    }}>
      {children}
    </AcademicDataContext.Provider>
  );
}

export function useAcademicData() {
  const context = useContext(AcademicDataContext);
  if (!context) throw new Error("useAcademicData debe usarse dentro de AcademicDataProvider");
  return context;
}
