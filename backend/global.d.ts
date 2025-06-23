import * as jwt from "jsonwebtoken";

//type definition required to store user object in request
declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload & { id: string; email: string; name: string };
    }
  }
}
