import { Express } from "express";

import {
  healthCheckhandler,
  loginHandler,
  signupHandler,
  getProfileHandler,
  getVideosHandler,
  uploadVideoHandler,
} from "./controllers";
import { manageUserSession, validateRequestBody } from "./middlewares";
import {
  SignupSchema,
  LoginSchema,
  UploadVideoSchema,
} from "./input_validation_schemas";
const routes = (app: Express) => {
  app.get("/api/v1/healthcheck", healthCheckhandler);
  app.post("/api/v1/signup", validateRequestBody(SignupSchema), signupHandler);
  app.post("/api/v1/login", validateRequestBody(LoginSchema), loginHandler);
  app.get("/api/v1/profile", manageUserSession, getProfileHandler);
  app.post(
    "/api/v1/upload",
    manageUserSession,
    validateRequestBody(UploadVideoSchema),
    uploadVideoHandler
  );
  app.get("/api/v1/videos", manageUserSession, getVideosHandler);
};

export default routes;
