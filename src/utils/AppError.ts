// src/utils/AppError.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly detalles: any;

  constructor(mensaje: string, statusCode: number = 400, detalles: any = null) {
    super(mensaje);
    this.statusCode = statusCode;
    this.detalles = detalles;
    Object.setPrototypeOf(this, AppError.prototype); // CORREGIDO
  }
}
// fin - archivo src/utils/AppError.ts 
