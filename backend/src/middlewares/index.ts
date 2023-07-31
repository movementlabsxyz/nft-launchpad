import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class MiddleWare {
  public static async verifyAdmin(req: Request, res: Response, next: NextFunction) {
    console.log("req.body =", req.body)
    console.log("req.query =", req.query)
    // Todo: check jwt 
    next()
  }
}