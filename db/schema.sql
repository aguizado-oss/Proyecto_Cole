-- =========================================================
-- Colegio Horizonte - Portal Académico
-- schema.sql (MySQL 8.0+)
-- =========================================================
CREATE DATABASE IF NOT EXISTS colegio_horizonte
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE colegio_horizonte;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- Estructura académica
-- ---------------------------------------------------------
CREATE TABLE grados (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(50) NOT NULL UNIQUE   -- '1° Secundaria' ... '5° Secundaria'
) ENGINE=InnoDB;

CREATE TABLE secciones (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  grado_id      INT NOT NULL,
  nombre        VARCHAR(5) NOT NULL,          -- 'A', 'B', 'C'
  CONSTRAINT fk_secciones_grado FOREIGN KEY (grado_id) REFERENCES grados(id) ON DELETE CASCADE,
  UNIQUE KEY uq_grado_seccion (grado_id, nombre)
) ENGINE=InnoDB;

CREATE TABLE periodos_academicos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(50) NOT NULL,         -- 'Bimestre I 2026'
  fecha_inicio  DATE NOT NULL,
  fecha_fin     DATE NOT NULL,
  anio          SMALLINT NOT NULL,
  activo        TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Personas
-- ---------------------------------------------------------
CREATE TABLE usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol           ENUM('estudiante','docente','admin') NOT NULL,
  creado_en     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE estudiantes (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id        INT NOT NULL UNIQUE,
  grado_id          INT NOT NULL,
  seccion_id        INT NOT NULL,
  codigo_matricula  VARCHAR(20) NOT NULL UNIQUE,
  CONSTRAINT fk_est_usuario  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)  ON DELETE CASCADE,
  CONSTRAINT fk_est_grado    FOREIGN KEY (grado_id)   REFERENCES grados(id)    ON DELETE RESTRICT,
  CONSTRAINT fk_est_seccion  FOREIGN KEY (seccion_id) REFERENCES secciones(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE docentes (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT NOT NULL UNIQUE,
  especialidad  VARCHAR(100),
  CONSTRAINT fk_doc_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Cursos (definidos a nivel de grado, reutilizables por sección)
-- ---------------------------------------------------------
CREATE TABLE cursos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  descripcion   TEXT,
  grado_id      INT NOT NULL,
  periodo_id    INT NOT NULL,
  modalidad     ENUM('Presencial','Virtual 24/7') NOT NULL DEFAULT 'Presencial',
  CONSTRAINT fk_curso_grado   FOREIGN KEY (grado_id)   REFERENCES grados(id)             ON DELETE CASCADE,
  CONSTRAINT fk_curso_periodo FOREIGN KEY (periodo_id) REFERENCES periodos_academicos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Une un curso a una sección concreta + su docente (esto es lo que "publica" el curso)
CREATE TABLE curso_secciones (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  curso_id        INT NOT NULL,
  seccion_id      INT NOT NULL,
  docente_id      INT NOT NULL,
  codigo          VARCHAR(20) NOT NULL,        -- ej. '18362'
  banner_aviso    TEXT,
  CONSTRAINT fk_cs_curso    FOREIGN KEY (curso_id)   REFERENCES cursos(id)    ON DELETE CASCADE,
  CONSTRAINT fk_cs_seccion  FOREIGN KEY (seccion_id) REFERENCES secciones(id) ON DELETE CASCADE,
  CONSTRAINT fk_cs_docente  FOREIGN KEY (docente_id) REFERENCES docentes(id)  ON DELETE RESTRICT,
  UNIQUE KEY uq_curso_seccion (curso_id, seccion_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Horarios
-- ---------------------------------------------------------
CREATE TABLE horarios (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  curso_seccion_id  INT NOT NULL,
  dia_semana        ENUM('Lun','Mar','Mie','Jue','Vie','Sab','Dom') NOT NULL,
  hora_inicio       TIME NOT NULL,
  hora_fin          TIME NOT NULL,
  aula              VARCHAR(20),
  CONSTRAINT fk_hor_cs FOREIGN KEY (curso_seccion_id) REFERENCES curso_secciones(id) ON DELETE CASCADE,
  CHECK (hora_fin > hora_inicio)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Contenido (pestaña "Contenido")
-- ---------------------------------------------------------
CREATE TABLE curso_semanas (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  curso_seccion_id  INT NOT NULL,
  numero            SMALLINT NOT NULL,
  titulo            VARCHAR(150) NOT NULL,
  CONSTRAINT fk_sem_cs FOREIGN KEY (curso_seccion_id) REFERENCES curso_secciones(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cs_semana (curso_seccion_id, numero)
) ENGINE=InnoDB;

CREATE TABLE curso_recursos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  semana_id         INT NOT NULL,
  titulo            VARCHAR(200) NOT NULL,
  tipo              ENUM('lectura','video','documento','link') NOT NULL DEFAULT 'lectura',
  contenido_url     VARCHAR(500),
  contenido_texto   TEXT,
  orden             SMALLINT NOT NULL DEFAULT 0,
  CONSTRAINT fk_rec_semana FOREIGN KEY (semana_id) REFERENCES curso_semanas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Evaluaciones y Tareas (pestañas "Evaluaciones" / "Tareas")
-- ---------------------------------------------------------
CREATE TABLE evaluaciones (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  curso_seccion_id  INT NOT NULL,
  titulo            VARCHAR(200) NOT NULL,
  tipo              ENUM('examen','practica','cuestionario') NOT NULL DEFAULT 'practica',
  fecha_inicio      DATETIME NOT NULL,
  fecha_fin         DATETIME NOT NULL,
  puntaje_max       DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  instrucciones     TEXT,
  CONSTRAINT fk_eval_cs FOREIGN KEY (curso_seccion_id) REFERENCES curso_secciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE tareas (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  curso_seccion_id  INT NOT NULL,
  titulo            VARCHAR(200) NOT NULL,
  fecha_entrega     DATETIME NOT NULL,
  puntaje_max       DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  instrucciones     TEXT,
  archivo_url       VARCHAR(500),
  CONSTRAINT fk_tarea_cs FOREIGN KEY (curso_seccion_id) REFERENCES curso_secciones(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Entregas y notas del alumno (esto sí es por alumno)
-- ---------------------------------------------------------
CREATE TABLE entregas_tarea (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  tarea_id          INT NOT NULL,
  estudiante_id     INT NOT NULL,
  archivo_url       VARCHAR(500),
  texto_respuesta   TEXT,
  fecha_entrega     TIMESTAMP NULL,
  nota              DECIMAL(5,2),
  estado            ENUM('pendiente','entregado','calificado') NOT NULL DEFAULT 'pendiente',
  CONSTRAINT fk_ent_tarea FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
  CONSTRAINT fk_ent_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
  UNIQUE KEY uq_tarea_estudiante (tarea_id, estudiante_id)
) ENGINE=InnoDB;

CREATE TABLE resultados_evaluacion (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  evaluacion_id     INT NOT NULL,
  estudiante_id     INT NOT NULL,
  nota              DECIMAL(5,2),
  fecha_rendido     TIMESTAMP NULL,
  estado            ENUM('pendiente','rendido','calificado') NOT NULL DEFAULT 'pendiente',
  CONSTRAINT fk_res_eval FOREIGN KEY (evaluacion_id) REFERENCES evaluaciones(id) ON DELETE CASCADE,
  CONSTRAINT fk_res_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
  UNIQUE KEY uq_eval_estudiante (evaluacion_id, estudiante_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Índices de apoyo para las consultas más frecuentes del lado alumno
-- ---------------------------------------------------------
CREATE INDEX idx_estudiantes_seccion       ON estudiantes(seccion_id);
CREATE INDEX idx_curso_secciones_seccion   ON curso_secciones(seccion_id);
CREATE INDEX idx_horarios_cs               ON horarios(curso_seccion_id);
CREATE INDEX idx_tareas_cs                 ON tareas(curso_seccion_id);
CREATE INDEX idx_evaluaciones_cs           ON evaluaciones(curso_seccion_id);
CREATE INDEX idx_entregas_estudiante       ON entregas_tarea(estudiante_id);
CREATE INDEX idx_resultados_estudiante     ON resultados_evaluacion(estudiante_id);

SET FOREIGN_KEY_CHECKS = 1;
