import { PrismaClient } from "@prisma/client";
import express from "express";
import UserServices from "../services/userServices/userService";

const app = express();

app.post("/user", async (req, res) => {

  const { full_name } = req.body;

  const user = UserServices.CreateNewUser(full_name)

  return res.status(201).json(user);
});

app.get("/user", async (req, res) => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();

  return res.status(200).json(users);
});

export default app