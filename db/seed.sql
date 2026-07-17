-- =========================================================
-- Colegio Horizonte - Portal Académico
-- seed.sql (datos de prueba, MySQL 8.0+)
-- Ejecutar DESPUÉS de schema.sql
-- =========================================================
USE colegio_horizonte;
SET NAMES utf8mb4;

-- Grados y secciones (1° a 5° de secundaria, una sección "A" cada uno)
INSERT INTO grados (nombre) VALUES
 ('1° Secundaria'), ('2° Secundaria'), ('3° Secundaria'),
 ('4° Secundaria'), ('5° Secundaria');

INSERT INTO secciones (grado_id, nombre)
SELECT id, 'A' FROM grados;

-- Periodo académico activo
INSERT INTO periodos_academicos (nombre, fecha_inicio, fecha_fin, anio, activo)
VALUES ('Bimestre III 2026', '2026-07-06', '2026-09-11', 2026, 1);

-- Usuarios: 1 docente por curso + 1 alumno de prueba
-- password_hash es un placeholder, reemplázalo con bcrypt/argon2 real en el backend
INSERT INTO usuarios (nombre, apellido, email, password_hash, rol) VALUES
 ('Marisol', 'Quispe',   'mquispe@horizonte.edu.pe',  '$2b$10$REEMPLAZAR', 'docente'),
 ('Jorge',   'Ramos',    'jramos@horizonte.edu.pe',   '$2b$10$REEMPLAZAR', 'docente'),
 ('Lucía',   'Fernández','lfernandez@horizonte.edu.pe','$2b$10$REEMPLAZAR', 'docente'),
 ('Bryan',   'Torres',   'btorres@horizonte.edu.pe',  '$2b$10$REEMPLAZAR', 'docente'),
 ('Xamir',   'Alumno',   'xamir.alumno@horizonte.edu.pe', '$2b$10$REEMPLAZAR', 'estudiante');

INSERT INTO docentes (usuario_id, especialidad)
SELECT id, 'Matemática'      FROM usuarios WHERE email = 'mquispe@horizonte.edu.pe';
INSERT INTO docentes (usuario_id, especialidad)
SELECT id, 'Comunicación'    FROM usuarios WHERE email = 'jramos@horizonte.edu.pe';
INSERT INTO docentes (usuario_id, especialidad)
SELECT id, 'Ciencia y Tecnología' FROM usuarios WHERE email = 'lfernandez@horizonte.edu.pe';
INSERT INTO docentes (usuario_id, especialidad)
SELECT id, 'Inglés'          FROM usuarios WHERE email = 'btorres@horizonte.edu.pe';

-- Alumno de prueba matriculado en 3° Secundaria - A
INSERT INTO estudiantes (usuario_id, grado_id, seccion_id, codigo_matricula)
SELECT u.id, g.id, s.id, '2026-SEC3A-001'
FROM usuarios u, grados g, secciones s
WHERE u.email = 'xamir.alumno@horizonte.edu.pe'
  AND g.nombre = '3° Secundaria'
  AND s.grado_id = g.id AND s.nombre = 'A';

-- Cursos típicos de colegio para 3° Secundaria
INSERT INTO cursos (nombre, descripcion, grado_id, periodo_id, modalidad)
SELECT 'Matemática', 'Álgebra, geometría y razonamiento matemático.', g.id, p.id, 'Presencial'
FROM grados g, periodos_academicos p WHERE g.nombre = '3° Secundaria' AND p.activo = 1;

INSERT INTO cursos (nombre, descripcion, grado_id, periodo_id, modalidad)
SELECT 'Comunicación', 'Comprensión lectora y producción de textos.', g.id, p.id, 'Presencial'
FROM grados g, periodos_academicos p WHERE g.nombre = '3° Secundaria' AND p.activo = 1;

INSERT INTO cursos (nombre, descripcion, grado_id, periodo_id, modalidad)
SELECT 'Ciencia y Tecnología', 'Física, química y biología aplicada.', g.id, p.id, 'Virtual 24/7'
FROM grados g, periodos_academicos p WHERE g.nombre = '3° Secundaria' AND p.activo = 1;

INSERT INTO cursos (nombre, descripcion, grado_id, periodo_id, modalidad)
SELECT 'Inglés', 'Speaking, listening, reading and writing.', g.id, p.id, 'Presencial'
FROM grados g, periodos_academicos p WHERE g.nombre = '3° Secundaria' AND p.activo = 1;

-- Publicar cada curso en la sección "3° Secundaria - A" con su docente
INSERT INTO curso_secciones (curso_id, seccion_id, docente_id, codigo, banner_aviso)
SELECT c.id, s.id, d.id, '30001', 'Recuerda revisar el material antes de cada clase.'
FROM cursos c
JOIN grados g ON g.id = c.grado_id AND g.nombre = '3° Secundaria'
JOIN secciones s ON s.grado_id = g.id AND s.nombre = 'A'
JOIN usuarios u ON u.email = 'mquispe@horizonte.edu.pe'
JOIN docentes d ON d.usuario_id = u.id
WHERE c.nombre = 'Matemática';

INSERT INTO curso_secciones (curso_id, seccion_id, docente_id, codigo)
SELECT c.id, s.id, d.id, '30002'
FROM cursos c
JOIN grados g ON g.id = c.grado_id AND g.nombre = '3° Secundaria'
JOIN secciones s ON s.grado_id = g.id AND s.nombre = 'A'
JOIN usuarios u ON u.email = 'jramos@horizonte.edu.pe'
JOIN docentes d ON d.usuario_id = u.id
WHERE c.nombre = 'Comunicación';

INSERT INTO curso_secciones (curso_id, seccion_id, docente_id, codigo)
SELECT c.id, s.id, d.id, '30003'
FROM cursos c
JOIN grados g ON g.id = c.grado_id AND g.nombre = '3° Secundaria'
JOIN secciones s ON s.grado_id = g.id AND s.nombre = 'A'
JOIN usuarios u ON u.email = 'lfernandez@horizonte.edu.pe'
JOIN docentes d ON d.usuario_id = u.id
WHERE c.nombre = 'Ciencia y Tecnología';

INSERT INTO curso_secciones (curso_id, seccion_id, docente_id, codigo)
SELECT c.id, s.id, d.id, '30004'
FROM cursos c
JOIN grados g ON g.id = c.grado_id AND g.nombre = '3° Secundaria'
JOIN secciones s ON s.grado_id = g.id AND s.nombre = 'A'
JOIN usuarios u ON u.email = 'btorres@horizonte.edu.pe'
JOIN docentes d ON d.usuario_id = u.id
WHERE c.nombre = 'Inglés';

-- Horario de ejemplo para Matemática (Lun y Mie, 8:00-9:30)
INSERT INTO horarios (curso_seccion_id, dia_semana, hora_inicio, hora_fin, aula)
SELECT cs.id, 'Lun', '08:00:00', '09:30:00', 'A0301'
FROM curso_secciones cs WHERE cs.codigo = '30001';
INSERT INTO horarios (curso_seccion_id, dia_semana, hora_inicio, hora_fin, aula)
SELECT cs.id, 'Mie', '08:00:00', '09:30:00', 'A0301'
FROM curso_secciones cs WHERE cs.codigo = '30001';

-- Una semana de contenido de ejemplo para Matemática
INSERT INTO curso_semanas (curso_seccion_id, numero, titulo)
SELECT cs.id, 1, 'Semana 01' FROM curso_secciones cs WHERE cs.codigo = '30001';

INSERT INTO curso_recursos (semana_id, titulo, tipo, contenido_texto, orden)
SELECT sem.id, 'Introducción a la semana', 'lectura', 'Bienvenida y objetivos de la semana 1.', 1
FROM curso_semanas sem
JOIN curso_secciones cs ON cs.id = sem.curso_seccion_id AND cs.codigo = '30001'
WHERE sem.numero = 1;

-- Una tarea y una evaluación de ejemplo para Matemática
INSERT INTO tareas (curso_seccion_id, titulo, fecha_entrega, puntaje_max, instrucciones)
SELECT cs.id, 'Práctica de ecuaciones lineales', '2026-07-25 23:59:00', 20.00,
       'Resolver los ejercicios 1 al 10 de la guía y subir el PDF.'
FROM curso_secciones cs WHERE cs.codigo = '30001';

INSERT INTO evaluaciones (curso_seccion_id, titulo, tipo, fecha_inicio, fecha_fin, puntaje_max, instrucciones)
SELECT cs.id, 'Examen Bimestral - Álgebra', 'examen', '2026-08-01 08:00:00', '2026-08-01 09:30:00', 20.00,
       'Examen escrito, duración 90 minutos, sin material de apoyo.'
FROM curso_secciones cs WHERE cs.codigo = '30001';
