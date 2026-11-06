
import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "API Biblioteca",
        description:
            "Documentación de la API REST de Biblioteca: Libros, Autores, Categorías, Ejemplares y Usuarios.",
    },
    host: "localhost:3000",
    basePath: "/api",
    schemes: ["http"],
};

const outputFile = "./src/swagger/swagger_output.json";

const routes = [
    "./src/routes/autores.routes.ts",
    "./src/routes/categorias.routes.ts",
    "./src/routes/ejemplares.routes.ts",
    "./src/routes/libros.routes.ts",
    "./src/routes/usuarios.routes.ts",
    "./src/routes/route.ts",
];

swaggerAutogen()(outputFile, routes, doc).then(() => {
    console.log("Documentación de Swagger generada exitosamente");
});
