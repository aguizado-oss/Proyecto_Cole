import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { PortalLayout } from "./components/PortalLayout";
import { AcademicDataProvider } from "./context/AcademicDataContext";
import { AdminAcademicPage } from "./features/admin/AdminAcademicPage";
import { LoginPage } from "./features/auth/LoginPage";
import { CalendarPage } from "./features/calendar/CalendarPage";
import { HomePage, PlaceholderPage } from "./features/common/CommonPages";
import { CourseDetailPage } from "./features/courses/CourseDetailPage";
import { CoursesPage } from "./features/courses/CoursesPage";
import type { SessionUser } from "./types";

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);

  if (!user) return <LoginPage onLogin={setUser} />;

  return (
    <AcademicDataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PortalLayout user={user} onLogout={() => setUser(null)} />}>
            <Route index element={<HomePage user={user} />} />
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="cursos" element={<CoursesPage user={user} />} />
            <Route path="cursos/:courseId" element={<CourseDetailPage user={user} />} />
            <Route path="pagos" element={<PlaceholderPage type="pagos" />} />
            <Route path="tramites" element={<PlaceholderPage type="tramites" />} />
            <Route path="mas" element={<PlaceholderPage type="mas" />} />
            <Route path="admin" element={user.role === "admin" ? <AdminAcademicPage /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AcademicDataProvider>
  );
}
