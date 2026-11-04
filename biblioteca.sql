-- 1. Categorias

CREATE TABLE Categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- 2. Autores

CREATE TABLE Autores (
    id_autor SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nacionalidad VARCHAR(100)
);

-- 3. Usuarios (Docentes y Estudiantes)

CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'Estudiante' o 'Docente'
    correo VARCHAR(100) UNIQUE
);

-- 4. Libros

CREATE TABLE Libros(
    id_libro SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    editorial VARCHAR(100),
    anio_publicacion INT, 
    id_categoria INT REFERENCES Categorias(id_categoria) ON DELETE
    SET NULL
);

-- 5. Tabla Intermedia Libro_Autor (Relación Muchos a Muchos)

CREATE TABLE Libro_Autor(
    id_libro INT REFERENCES Libros(id_libro) ON DELETE CASCADE,
    id_autor INT REFERENCES Autores(id_autor) ON DELETE CASCADE,
    PRIMARY KEY (id_libro, id_autor)
);

-- 6. Tabla Ejemplares (Cada libro físico individual)

CREATE TABLE Ejemplares (
    id_ejemplar SERIAL PRIMARY KEY,
    id_libro INT REFERENCES Libros(id_libro) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'Disponible' -- 'Disponible', 'Prestado'
);

-- 7. Tabla Prestamos (Historial y control)

CREATE TABLE Prestamos(
    id_prestamo SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES Usuarios(id_usuario) ON DELETE RESTRICT,
    id_ejemplar INT REFERENCES Ejemplares(id_ejemplar) ON DELETE RESTRICT,
    fecha_entrega DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_limite DATE NOT NULL,
    fecha_real_devolucion DATE
);
-- 1. Insertar Categorías
INSERT INTO Categorias (nombre) VALUES 
('Ciencia Ficción'),
('Física y Matemática'),
('Programación y Software'),
('Novela Histórica'),
('Filosofía');

-- 2. Insertar Autores
INSERT INTO Autores (nombre, nacionalidad) VALUES 
('Isaac Asimov', 'Rusa'),
('Stephen Hawking', 'Británica'),
('Robert C. Martin', 'Estadounidense'),
('Gabriel García Márquez', 'Colombiana'),
('Friedrich Nietzsche', 'Alemana');

-- 3. Insertar Usuarios
INSERT INTO Usuarios (nombre, tipo, correo) VALUES 
('Carlos Mendoza', 'Estudiante', 'carlos.mendoza@universidad.edu'),
('Ana Gómez', 'Docente', 'ana.gomez@universidad.edu'),
('Luis Torrealba', 'Estudiante', 'luis.torrealba@universidad.edu'),
('Beatriz Ortiz', 'Docente', 'beatriz.ortiz@universidad.edu');
-- 4. Insertar Libros
-- Nota: Asumimos los IDs generados para categorías (1: Ciencia Ficción, 2: Física, 3: Programación, 4: Novela, 5: Filosofía)
INSERT INTO Libros (titulo, editorial, anio_publicacion, id_categoria) VALUES 
('Fundación', 'Gnomo', 1951, 1),
('Breve historia del tiempo', 'Bantam Books', 1988, 2),
('Clean Code', 'Prentice Hall', 2008, 3),
('Cien años de soledad', 'Sudamericana', 1967, 4),
('Así habló Zaratustra', 'Schmeitzner', 1883, 5);

-- 5. Insertar Relación Libro_Autor (Muchos a Muchos)
-- Asumiendo correspondencia exacta entre el orden de inserción de libros y autores
INSERT INTO Libro_Autor (id_libro, id_autor) VALUES 
(1, 1), -- Fundación -> Isaac Asimov
(2, 2), -- Breve historia del tiempo -> Stephen Hawking
(3, 3), -- Clean Code -> Robert C. Martin
(4, 4), -- Cien años de soledad -> Gabriel García Márquez
(5, 5); -- Así habló Zaratustra -> Friedrich Nietzsche
-- 6. Insertar Ejemplares (Copias físicas individuales de los libros) -- Creamos múltiples copias físicas de los libros insertados previamente INSERT INTO Ejemplares (id_libro, estado) VALUES (1, 'Disponible'), -- Copia 1 de Fundación (1, 'Prestado'), -- Copia 2 de Fundación (2, 'Disponible'), -- Copia 1 de Breve historia... (3, 'Prestado'), -- Copia 1 de Clean Code (3, 'Disponible'), -- Copia 2 de Clean Code (4, 'Disponible'), -- Copia 1 de Cien años de soledad (5, 'Disponible'); -- Copia 1 de Así habló Zaratustra
-- 7. Insertar Préstamos (Historial y control) -- Vincula usuarios con los ejemplares marcados como 'Prestado' INSERT INTO Prestamos (id_usuario, id_ejemplar, fecha_entrega, fecha_limite, fecha_real_devolucion)
VALUES (1, 2, '2026-10-15', '2026-10-22', '2026-10-21'), -- Carlos pidió copia 2 de Fundación y ya la devolvió (3, 2, '2026-10-25', '2026-11-01', NULL), -- Luis tiene actualmente la copia 2 de Fundación (retrasado o activo) (2, 4, '2026-11-01', '2026-11-08', NULL); 