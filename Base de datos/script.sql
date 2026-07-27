-- Tabla de materias (Conjunto Universal)
CREATE TABLE courses ( 
	id SERIAL PRIMARY KEY, 
	name VARCHAR(100) NOT NULL, 
	day VARCHAR(20) NOT NULL, 
	start_time TIME NOT NULL, 
	end_time TIME NOT NULL, 
	modality VARCHAR(20) NOT NULL, 
	difficulty VARCHAR(20) NOT NULL, 
	credits INTEGER NOT NULL 
); 

-- Tabla de prerrequisitos (Relación e Implicación)
CREATE TABLE prerequisites (
	course_id INTEGER NOT NULL,
	prerequisite_course_id INTEGER NOT NULL,
	PRIMARY KEY (
		course_id, 
		prerequisite_course_id
	),
	FOREIGN KEY (course_id) REFERENCES courses(id),
	FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id)
);

--Insertar en courses
INSERT INTO courses (name, day, start_time, end_time, modality, difficulty, credits) 
VALUES 
('Base de datos básica', 'Lunes', '08:00', '10:00', 'Presencial', 'Media', 4), -- ID asumido: 1
('Base de datos avanzada', 'Martes', '10:00', '12:00', 'Virtual', 'Alta', 4);  -- ID asumido: 2
--Insertar en prerequisites
INSERT INTO prerequisites (course_id, prerequisite_course_id) 
VALUES (2, 1); -- La materia 2 (Base de datos avanzada) requiere el prerrequisito 1 (Base de datos básica)

--Materias
INSERT INTO courses (name, day, start_time, end_time, modality, difficulty, credits) 
VALUES 
('Programacion', 'Lunes', '08:00', '10:00', 'Presencial', 'Alta', 4),--Primer Nivel (Semestre 1 - Materias Fundamentales):
('Matematicas', 'Martes', '08:00', '10:00', 'Presencial', 'Alta', 4),--Primer Nivel (Semestre 1 - Materias Fundamentales):
('Ingles', 'Lunes', '10:00', '12:00', 'Virtual', 'Baja', 2),--Primer Nivel (Semestre 1 - Materias Fundamentales):
('Redes', 'Martes', '10:00', '12:00', 'Virtual', 'Media', 3),--Segundo Nivel (Semestre 2):
('Base de datos básica', 'Miercoles', '08:00', '10:00', 'Virtual', 'Media', 4),--Segundo Nivel (Semestre 2):
('Diseño web', 'Miercoles', '10:00', '12:00', 'Virtual', 'Baja', 3),--Segundo Nivel (Semestre 2):
('Base de datos avanzada', 'Jueves', '08:00', '10:00', 'Presencial', 'Alta', 4),--Tercer Nivel (Semestre 3 - Materias Avanzadas con Prerrequisitos):
('Estructura de datos', 'Viernes', '08:00', '10:00', 'Presencial', 'Alta', 4);--Tercer Nivel (Semestre 3 - Materias Avanzadas con Prerrequisitos):
INSERT INTO prerequisites (course_id, prerequisite_course_id) 
VALUES 
(6, 5),
(7, 1);

