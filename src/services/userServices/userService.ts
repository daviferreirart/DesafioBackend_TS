import dbServices from "../database/databaseServices";

export default class UserServices {
  public static async CreateNewUser(full_name: string) {
    return dbServices.CreateNewUser(full_name);
  }

  public static async UpdateSubscription(user_id: number, status: string) {
    return dbServices.UpdateUserSubscriptionStatus(user_id, status);
  }
}
