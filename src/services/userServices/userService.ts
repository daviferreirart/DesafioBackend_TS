import { PrismaClient, Status, User } from "@prisma/client";
import AppError from "../../error/AppError";
import { subscribed, restarted, canceled } from "../../helper/statusMessages";

export default class UserServices {
  public static async CreateNewUser(
    full_name: string
  ): Promise<User | undefined> {
    const prisma = new PrismaClient();

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

      await prisma.eventHistory.create({
        data: {
          type: subscribed,
          subscription_id: subscription.id,
        },
      });
    }
    return user;
  }
}
