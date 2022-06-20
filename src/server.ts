import express from "express";
import "express-async-errors";
import status from "./routes/status.routes";
import subscription from "./routes/subscription.routes";
import events from "./routes/eventHistory.routes";
import user from "./routes/user.routes";
import errorHandler from "./error/handler";

export const application = async () => {
  const app = express();
  const err = errorHandler;
  app.use(express.json());

  app.use(status, subscription, events, user);
  app.use(err);
  return app;
};
