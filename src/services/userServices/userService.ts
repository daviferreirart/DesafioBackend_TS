import { PrismaClient, Status, User } from "@prisma/client";
import AppError from "../../error/AppError";
import { query } from "../../helper/query";
import { subscribed, restarted, canceled } from "../../helper/statusMessages";
import Rabbit from "../rabbitServices/Rabbitmq";
import { rabbitmqHost } from "../rabbitServices/RabbitVerifier";

export default class UserServices {
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

    const checkIfUserHasAnySubscription = await prisma.subscription.findMany({
      where: {
        user_id: user.id,
      },
    });

    if (checkIfUserHasAnySubscription) {
      const registeredStatus = await prisma.status.create({
        data: {
          status_name: subscribed,
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
    }
    return user;
  }

  public static async UpdateSubscription(
    user_id: number,
    status: string
  ): Promise<User | null> {
    const prisma = new PrismaClient();
    const rabbit = new Rabbit();

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

    const currentStatus = prisma.$queryRaw`${query}${user_id};`
    const stringfiedStatus = JSON.stringify(currentStatus)

    try {
      if(!stringfiedStatus.includes(status) && status === canceled){
          await prisma.status.update({
            where: {
              id: subscription?.status_id,
            },
            data: {
              status_name: canceled,
            },
          });

          rabbit.Sender(rabbitmqHost, canceled);

          await prisma.eventHistory.create({
            data: {
              type: canceled,
              subscription_id: subscription?.id,
              
            },
          });
        }
      
        else if(!stringfiedStatus.includes(status) && status === restarted){
          await prisma.status.update({
            where: {
              id: subscription?.status_id,
            },
            data: {
              status_name: restarted,
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
    } catch (e) {
      console.log(e);
    }

    return userInfo;
  }
}
