import express from "express";
import "express-async-errors";

import user from "./routes/user.routes";
import errorHandler from "./error/handler";

export const application = async () => {
  const app = express();
  const err = errorHandler;
  app.use(express.json());

  app.use(user);
  app.use(err);
  return app;
};
