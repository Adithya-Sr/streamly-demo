import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import config from "./config";
import rateLimit from "express-rate-limit";

//rate limiting middleware
//50 requests per 10 minutes for each IP
export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests. Please try again later.",
});

//Request body validator middleware using zod
export const validateRequestBody =
  (schema: z.ZodType<any, any, any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        console.log(e.errors);
        res.status(400).json({ error: e.errors });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

//session management middleware
export const manageUserSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //retrieve tokens from request
  let accessToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"];
  if (!accessToken && !refreshToken) {
    if (req.user) {
      req.user = undefined;
    }
    res.status(403).json({ error: "Invalid Tokens" });
    return;
  }

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, config.HMACSecretKey);
      req.user = decoded as jwt.JwtPayload & {
        id: string;
        email: string;
        name: string;
      };
      next();
      return;
    } catch (e: any) {
      //clear access-token cookie due to the underlying jwt being invalid
      res.clearCookie("access-token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    }
  }
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.HMACSecretKey);
      req.user = decoded as jwt.JwtPayload & {
        id: string;
        email: string;
        name: string;
      };
      const newAccessToken = jwt.sign(decoded, config.HMACSecretKey, {
        expiresIn: "1d",
      });
      const ONE_DAY = 1000 * 60 * 60 * 24;
      res.cookie("access-token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + ONE_DAY),
        path: "/",
      });

      next();
      return;
    } catch (e: any) {
      console.log(e);
      if (req.user) {
        req.user = undefined;
      }
      res.clearCookie("refresh-token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.status(403).json({ error: "Invalid Tokens" });
      return;
    }
  }
  //reset user state as both tokens are missing/invalid
  if (req.user) {
    req.user = undefined;
  }
  res.status(403).json({ error: "Invalid Tokens" });
  return;
};
