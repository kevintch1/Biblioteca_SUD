 import { z } from "zod";

 export const GetUserQuerySchema = z.object({
  query: z.object({
    nombre: z.string().optional(),
    correo: z.string().email().optional(),
    page: z
    .string()
    .regex(/^\d+$/, "la page debe ser un numero")
    .transform(Number)
    .default(1),
    limit: z
    .string()
    .regex(/^\d+$/, "el limite debe ser un numero")
    .transform(Number)
    .default(10),
  }),
});
export type GetUserQueryInput = z.infer<typeof GetUserQuerySchema>["query"];

export const GetUserParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "El ID debe ser un número entero").transform(Number),
  }),
});

export type GetUserParamsInput = z.infer<typeof GetUserParamsSchema>["params"];

 export const obtenerUsuariosSchema = z.object({
     id: z.string(),
  nombre: z.string()
  .min(2, "el nombre debe tener al menos dos caracteres")
  .max(150, "el nombre no debe superar los 150 caracteres"),
  correo: z.string().email("formato de correo no valido"),
});


export const obtenerUsuarioPorIdSchema = z.object({
     params: z.object({
    id: z.string()
    .regex(/^\d+$/, "El ID debe ser un número entero válido")
      .transform((val) => Number(val)),
  })
});

export const crearUsuarioSchema = z.object({
   nombre: z.string()
    .trim()
    .min(2, "el nombre debe tener almenos 2 caracteres")
    .max(150, "el nombre no puede superar los 150 caracteres"),
    tipo: z.string()
    .min(2, "el tipo debe tener almenos 2 caracteres")
    .max(50, "el tipo no puede superar los 50 caracteres"),
    correo: z.string().email("formato de correo no valido"),
});

export const actualizarUsuarioSchema = z.object({
params: z.object({
    id: z.number(),
    }),
     body: z.object({
     nombre: z.string()
     .trim()
     .min(2, "el nombre debe tener almenos 2 caracteres")
     .max(150, "el nombre no puede superar los 150 caracteres")
     .optional(),
    
    
    tipo: z.string()
    .min(2, "el tipo debe tener almenos 2 caracteres")
    .max(50, "el tipo no puede superar los 50 caracteres")
    .optional(),

    correo: z.string().email("formato de correo no valido")
    .optional(),
}) .strict(), 

});
export const EliminarUsuarioSchema = z.object({
  params: z.object({
    id: z
    .string()
      .regex(/^\d+$/, "El ID debe ser un número entero válido")
      .transform((val) => Number(val)),
  }),
});

   
