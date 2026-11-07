
import swaggerAutogen from "swagger-autogen";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const doc = {
    info: {
        title: "API Biblioteca",
        description:
            "Documentación de la API REST de Biblioteca: Libros, Autores, Categorías, Ejemplares, Usuarios, Préstamos y Libro-Autor.",
        version: "1.0.0",
    },
    host: "localhost:3000",
    basePath: "/api",
    schemes: ["http"],
    tags: [
        { name: "Libros", description: "Gestión de libros" },
        { name: "Usuarios", description: "Gestión de usuarios" },
        { name: "Autores", description: "Gestión de autores" },
        { name: "Categorías", description: "Gestión de categorías" },
        { name: "Ejemplares", description: "Gestión de ejemplares" },
        { name: "Préstamos", description: "Gestión de préstamos" },
        { name: "Libro-Autor", description: "Relación entre libros y autores" },
    ],
};

const outputFile = "./src/swagger/swagger_output.json";

const routers = [
    { name: "libros", file: "./src/routes/libros.routes.ts", prefix: "/libros", tag: "Libros" },
    { name: "usuarios", file: "./src/routes/usuarios.routes.ts", prefix: "/usuarios", tag: "Usuarios" },
    { name: "autores", file: "./src/routes/autores.routes.ts", prefix: "/autores", tag: "Autores" },
    { name: "categorias", file: "./src/routes/categorias.routes.ts", prefix: "/categorias", tag: "Categorías" },
    { name: "ejemplares", file: "./src/routes/ejemplares.routes.ts", prefix: "/ejemplares", tag: "Ejemplares" },
    { name: "prestamos", file: "./src/routes/prestamosRoute.ts", prefix: "/prestamos", tag: "Préstamos" },
    { name: "libro-autor", file: "./src/routes/route.ts", prefix: "", tag: "Libro-Autor" },
];

async function generarSwagger() {
    const carpetaTemporal = await mkdtemp(
        join(tmpdir(), "swagger-biblioteca-")
    );

    try {
        const generar = swaggerAutogen();
        const documentacionFinal: Record<string, any> = {};
        let documentoBase: any;

        for (const router of routers) {
            const archivoTemporal = join(
                carpetaTemporal,
                `${router.name}.json`
            );

            await generar(archivoTemporal, [router.file], doc);

            const contenido = await readFile(archivoTemporal, "utf8");
            const documento = JSON.parse(contenido);

            documentoBase = documento;

            for (const [ruta, metodos] of Object.entries(
                documento.paths ?? {}
            )) {
                const rutaCompleta =
                    `${router.prefix}${ruta === "/" ? "" : ruta}` || "/";

                const operaciones = metodos as Record<string, any>;

                for (const operacion of Object.values(operaciones)) {
                    if (operacion && typeof operacion === "object") {
                        operacion.tags = [router.tag];
                    }
                }

                documentacionFinal[rutaCompleta] = {
                    ...(documentacionFinal[rutaCompleta] ?? {}),
                    ...operaciones,
                };
            }
        }

        const resultado = {
            ...documentoBase,
            tags: doc.tags,
            paths: documentacionFinal,
        };

        await writeFile(
            outputFile,
            JSON.stringify(resultado, null, 2),
            "utf8"
        );

        console.log("Documentación de Swagger generada exitosamente");
    } finally {
        await rm(carpetaTemporal, {
            recursive: true,
            force: true,
        });
    }
}

generarSwagger().catch((error) => {
    console.error("Error al generar Swagger:", error);
    process.exitCode = 1;
});
