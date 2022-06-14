import { PrismaClient, User } from "@prisma/client";
import AppError from "../../error/AppError";
import { query } from "../../helper/query";
import {
  cancelado,
  canceled,
  ativo,
  restarted,
  subscribed,
} from "../../helper/statusMessages";
import Rabbit from "../rabbitServices/Rabbitmq";
import { rabbitmqHost } from "../rabbitServices/RabbitVerifier";

export default abstract class dbServices {
  public static async CreateNewUser(
    full_name: string
  ): Promise<User | undefined> {
    const prisma = new PrismaClient();
    const rabbit = new Rabbit();

    const user = await prisma.user.create({
      data: {
        full_name,
      },
    });

    const registeredStatus = await prisma.status.create({
      data: {
        status_name: ativo,
      },
    });

    const subscription = await prisma.subscription.create({
      data: {
        status_id: registeredStatus.id,
        user_id: user.id,
      },
    });

    rabbit.Sender(rabbitmqHost, subscribed);

    await prisma.eventHistory.create({
      data: {
        type: subscribed,
        subscription_id: subscription.id,
      },
    });
    return user;
  }

  public static async UpdateUserSubscriptionStatus(
    user_id: number,
    status: string
  ): Promise<User | null> {
    const prisma = new PrismaClient();
    const rabbit = new Rabbit();
    status = status.toLowerCase()
    const userInfo = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });

    const subscription = await prisma.subscription.findFirst({
      where: {
        user_id: user_id,
      },
    });

    const currentStatus = prisma.$queryRaw`${query}${user_id};`;
    const stringfiedStatus = JSON.stringify(currentStatus);
    try {
      if (!stringfiedStatus.includes(status) && status === cancelado) {
        await prisma.status.update({
          where: {
            id: subscription?.status_id,
          },
          data: {
            status_name: cancelado,
          },
        });

        rabbit.Sender(rabbitmqHost, canceled);
        await prisma.eventHistory.create({
          data: {
            type: canceled,
            subscription_id: subscription?.id,
          },
        });
      } else if (!stringfiedStatus.includes(status) && status === ativo) {
        await prisma.status.update({
          where: {
            id: subscription?.status_id,
          },
          data: {
            status_name: ativo,
          },
        });

        rabbit.Sender(rabbitmqHost, restarted);
        await prisma.eventHistory.create({
          data: {
            type: restarted,
            subscription_id: subscription?.id,
          },
        });
      }
      throw new AppError("Status foi diferente de ativo ou cancelado!")
    } catch (e) {
      console.log(e);
    }

    return userInfo;
  }
}
