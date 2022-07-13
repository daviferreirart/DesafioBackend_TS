import { PrismaClient, Subscription, User } from "@prisma/client";
import AppError from "../../error/AppError";
import { query, userInfo } from "../../helper/query";
import { userBodyInfo } from "../../helper/typo";
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
  ): Promise<Subscription | null> {
    const prisma = new PrismaClient();
    const rabbit = new Rabbit();

    status = status.toLowerCase();
    if (status != cancelado && status != ativo) {
      throw new AppError("Invalid status");
    }
    const userInfo = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });
    if (userInfo) {
      const oldSubscription = await prisma.subscription.findUnique({
        where: {
          id: user_id,
        },
      });

      const currentStatus = prisma.$queryRaw`${query}${user_id};`;
      const stringfiedStatus = JSON.stringify(currentStatus);

      if (!stringfiedStatus.includes(status) && status === cancelado) {
        await prisma.status.update({
          where: {
            id: oldSubscription?.status_id,
          },
          data: {
            status_name: cancelado,
          },
        });

        rabbit.Sender(rabbitmqHost, canceled);
        await prisma.eventHistory.create({
          data: {
            type: canceled,
            subscription_id: oldSubscription?.id,
          },
        });
      } else if (!stringfiedStatus.includes(status) && status === ativo) {
        await prisma.status.update({
          where: {
            id: oldSubscription?.status_id,
          },
          data: {
            status_name: ativo,
          },
        });

        rabbit.Sender(rabbitmqHost, restarted);
        await prisma.eventHistory.create({
          data: {
            type: restarted,
            subscription_id: oldSubscription?.id,
          },
        });
      }
      const currentSubscription = await prisma.subscription.findFirst({
        where: { user_id: user_id },
      });
      await prisma.subscription.update({
        where: { id: currentSubscription?.id },
        data: {
          updated_at: new Date(),
        },
      });
      return currentSubscription;
    }
    throw new AppError("The given id for the user was not found");
  }
  public static async getAllUserInfo(
    user_id: string
  ): Promise<userBodyInfo | unknown> {
    const id = Number(user_id);
    const prisma = new PrismaClient();
    const userExists = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (userExists) {
      const info = prisma.$queryRawUnsafe(`${userInfo}${user_id};`);
      return info;
    }
    throw new AppError("The given id for the user doesnt exists!");
  }
}
