// src/utils/catchAsync.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const catchAsync = (
  fn: (req: Request<any, any, any, any>, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Envía el error al middleware global
  };
};
// fin - archivo src/utils/catchAsync.ts