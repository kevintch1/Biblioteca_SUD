
import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "API Biblioteca",
        description:
            "Documentación de la API REST de Biblioteca: Libros, Autores, Categorías, Ejemplares y Usuarios.",
    },
    host: "localhost:3000",
    schemes: ["http"],
};

const outputFile = "./src/swagger/swagger_output.json";

const routes = ["./src/index.ts"];

swaggerAutogen()(outputFile, routes, doc).then(() => {
    console.log("Documentación de Swagger generada exitosamente");
});
