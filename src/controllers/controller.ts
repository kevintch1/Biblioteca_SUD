import type { Response, Request } from "express";

/*import { query } from "../config/db.js";
export async fuction getUsers(req: request, res: response){
    try {
        const { rows } = await query("SELECT * FROM users ORDER BY id ASC");
        response.json(rows);
    } catch (error) {
        console.error(error);
        response.status(500).json({
            error: "Erros al obtener los usuarios",
        });
    }
}
*/