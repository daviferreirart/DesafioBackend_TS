import { Application } from "express";
import { application } from "../server";
import Rabbit, { rabbitmqHost } from "../services/rabbitServices/Rabbitmq";
const rabbitClient = new Rabbit();

describe("Rabbit suite", () => {
  let app: Application;
  const message = "Valid message";
  const invalidMessage = "Invalid message";

  beforeAll(async () => {
    app = await application();
  });
  it("Should be able to send a message to the queue", async () => {
    const result = rabbitClient.Sender(rabbitmqHost, message);
    expect(result).toBeTruthy();
  });
});
