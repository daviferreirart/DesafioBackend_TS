import { Application } from "express";
import { application } from "../server";
import request from "supertest";
import { User } from "@prisma/client";
import { Omit } from "../helper/omit";
import UserServices from "../services/userServices/userService";
import { cancelado } from "../helper/statusMessages";

type updateBody = {
  id: number;
  status: string;
};

describe("Users suite", () => {
  let app: Application;

  beforeAll(async () => {
    app = await application();
  });

  it("should be able to get all users", async () => {
    const response = await request(app).get("/user");
    expect((response.statusCode = 200));
  });
  it("should be able to create a new user", async () => {
    const body: Omit<User, "id" | "created_at"> = {
      full_name: "Davi",
    };
    const response = await request(app).post("/user").send(body);
    expect(response.body).toBeDefined();
    expect(response.status).toBe(201);
  });

  it("shouldnt be able to create a new user with empty name", async () => {
    const body: Omit<User, "id" | "created_at"> = {
      full_name: "",
    };
    const response = await request(app).post("/user").send(body);
    expect(response.body.message).toBe("Empty name");
    expect(response.status).toBe(400);
  });

  it("Should be able to update a new user with the correct atributes", async () => {
    const user = await UserServices.CreateNewUser("Teste");
    if (user) {
      const userToBeUpdatedBody: updateBody = {
        id: user.id,
        status: cancelado,
      };
      const response = await request(app)
        .put("/user")
        .send(userToBeUpdatedBody);
      expect(response.body).toBeDefined();
      expect(response.status).toBe(200);
    }
  });

  it("Shouldnt be able to update a new user with the wrong atributes", async () => {
    const user = await UserServices.CreateNewUser("Teste invalido");
    if (user) {
      const userToBeUpdatedBody: updateBody = {
        id: user.id,
        status: "invalido",
      };
      const response = await request(app)
        .put("/user")
        .send(userToBeUpdatedBody);
      expect(response.body).toBeDefined()
      expect(response.status).toBe(400);
    }
  });
});
