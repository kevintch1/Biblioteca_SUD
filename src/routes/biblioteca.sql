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
CREATE TABLE Libros (
    id_libro SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    editorial VARCHAR(100),
    anio_publicacion INT,
    id_categoria INT REFERENCES Categorias(id_categoria) ON DELETE SET NULL
);

-- 5. Tabla Intermedia Libro_Autor (Relación Muchos a Muchos)
CREATE TABLE Libro_Autor (
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
CREATE TABLE Prestamos (
    id_prestamo SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES Usuarios(id_usuario) ON DELETE RESTRICT,
    id_ejemplar INT REFERENCES Ejemplares(id_ejemplar) ON DELETE RESTRICT,
    fecha_entrega DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_limite DATE NOT NULL,
    fecha_real_devolucion DATE
);