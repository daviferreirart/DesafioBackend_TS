import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();

app.post("/user", async (req, res) => {
  const prisma = new PrismaClient();

  const { name } = req.body;

  const username = await prisma.user.create({
    data: {
      full_name: name,
    },
  });
  return res.status(201).json(username);
});

app.get("/user", async (req, res) => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();

  return res.status(200).json(users);
});