import { PrismaClient } from "@prisma/client";
import express from "express";
import UserServices from "../services/userServices/userService";

const app = express();

app.post("/user", async (req, res) => {

  const { full_name } = req.body;

  const user = await UserServices.CreateNewUser(full_name)

  return res.status(201).json(user);
});

app.get("/user", async (req, res) => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();

  return res.status(200).json(users);
});

app.put('/user/',async(req,res)=>{
  const {id,status} = req.body

  const updatedUserStatus = await UserServices.UpdateSubscription(id,status)
  
  return res.status(200).json(updatedUserStatus)
})

export default app