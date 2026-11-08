# Biblioteca API REST

API REST para la gestión de una biblioteca, desarrollada con **Node.js, Express, TypeScript y PostgreSQL**. Incluye documentación interactiva de los endpoints mediante Swagger.

## 1. Tecnologías utilizadas

- Node.js
- TypeScript
- Express
- PostgreSQL
- `pg` para la conexión con PostgreSQL
- Zod para la validación de datos
- Swagger para la documentación de la API
- dotenv para las variables de entorno

## 2. Requisitos previos

Antes de comenzar, debes tener instalado:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/)
- Un editor de código, como [Visual Studio Code](https://code.visualstudio.com/)

## 3. Clonar el repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/kevintch1/Biblioteca_SUD.git
```

Ingresa a la carpeta del proyecto:

```bash
cd Biblioteca_SUD
```

Para trabajar con la rama que contiene los últimos cambios:

```bash
git switch feature/tabla-intermedia-libro-autor
```

## 4. Instalar las dependencias

Dentro de la carpeta del proyecto, ejecuta:

```bash
npm install
```

Este comando instala todas las dependencias necesarias definidas en `package.json`.

## 5. Configurar la base de datos

1. Abre PostgreSQL.
2. Crea una base de datos para el proyecto.
3. Ejecuta en esa base de datos los scripts SQL del proyecto, si están disponibles, para crear las tablas necesarias.
4. Comprueba que PostgreSQL esté funcionando.

### Configurar las variables de entorno

En la raíz del proyecto, crea un archivo llamado `.env`.

Agrega la siguiente configuración y reemplaza los valores de ejemplo por los datos de tu PostgreSQL:

```env
PORT=3000
DATABASE_URL=postgresql://USUARIO:CONTRASEÑA@localhost:5432/NOMBRE_BASE_DATOS
```

**Importante:** No compartas ni subas el archivo `.env` a GitHub, porque contiene información de conexión privada.

## 6. Generar la documentación Swagger

Para generar el archivo de documentación de Swagger, ejecuta:

```bash
npx tsx src/swagger/swagger.ts
```

Este comando genera o actualiza:

```text
src/swagger/swagger_output.json
```

## 7. Compilar el proyecto

Para comprobar que el código TypeScript no tenga errores de compilación, ejecuta:

```bash
npm run build
```

## 8. Ejecutar el servidor

Para iniciar el servidor en modo desarrollo, ejecuta:

```bash
npm run dev
```

Si todo funciona correctamente, aparecerá un mensaje indicando que el servidor está ejecutándose en el puerto 3000.

## 9. Abrir Swagger

Con el servidor en ejecución, abre tu navegador y visita:

**http://localhost:3000/api-docs**

Desde Swagger podrás visualizar y probar los endpoints de la API.

## 10. Módulos disponibles

La API contiene los siguientes módulos:

- **Libros:** operaciones para consultar, registrar, actualizar y eliminar libros.
- **Usuarios:** gestión de usuarios.
- **Autores:** gestión de autores.
- **Categorías:** gestión de categorías.
- **Ejemplares:** gestión de ejemplares de libros.
- **Préstamos:** gestión de préstamos.
- **Libro-Autor:** administración de la relación entre libros y autores.

## 11. Endpoints principales

| Método     | Función                          |
| ---------- | -------------------------------- |
| GET        | Consultar registros              |
| GET por ID | Consultar un registro específico |
| POST       | Crear un registro                |
| PUT        | Actualizar un registro           |
| DELETE     | Eliminar un registro             |

Los endpoints completos, sus parámetros y los esquemas de respuesta se pueden consultar en Swagger.

## 12. Solución de problemas

**Error de conexión con PostgreSQL**

- Comprueba que PostgreSQL esté iniciado.
- Verifica el usuario, contraseña, puerto y nombre de la base de datos en `.env`.
- Comprueba que las tablas necesarias existan.

**No se puede abrir Swagger**

- Comprueba que el servidor esté ejecutándose.
- Verifica que hayas generado `swagger_output.json`.
- Abre nuevamente `http://localhost:3000/api-docs`.

**Error al instalar dependencias**

Ejecuta nuevamente:

```bash
npm install
```

---

## Autor

Proyecto académico de desarrollo backend.

**Tecnologías principales:** Node.js, Express, TypeScript y PostgreSQL.
