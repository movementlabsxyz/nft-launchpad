import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

function getDataFromJwt(token: string) {
  try {
    let user = jwt.verify(token, process.env.JWT_SECKEY);
    return (user as any).data;
  } catch {
    return null;
  }
}
export class MiddleWare {
  public static async verifyCreatorJwt(req: Request, res: Response, next: NextFunction) {

    const auth_header = req.headers.authorization;
    if(!auth_header) {
      res.status(401).send({
        message: "Authorization failed"
      });
      return;
    }

    const accessToken = auth_header.split(' ')[1];
    let data = getDataFromJwt(accessToken);
    if (data && data.role === 0) {
      console.log("auth middleware success")
      next()
    } else {
      res.status(401).send({
        message: "Authorization failed"
      });
    }
  }

  public static async verifyAdminJwt(req: Request, res: Response, next: NextFunction) {

    const auth_header = req.headers.authorization;
    if(!auth_header) {
      res.status(401).send({
        message: "Authorization failed"
      });
      return;
    }

    const accessToken = auth_header.split(' ')[1];
    let data = getDataFromJwt(accessToken);
    if (data && data.role === 1) {
      console.log("auth middleware success")
      next()
    } else {
      res.status(401).send({
        message: "Authorization failed"
      });
    }
  }
}