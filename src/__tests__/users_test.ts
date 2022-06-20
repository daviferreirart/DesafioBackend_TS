import { Application } from "express";
import { application } from "../server";
import request from "supertest";
import { User } from "@prisma/client";
import { Omit } from "../helper/omit";

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
});
