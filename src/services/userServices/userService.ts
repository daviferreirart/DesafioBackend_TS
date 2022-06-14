import dbServices from "../database/databaseServices";

export default class UserServices {
  public static async CreateNewUser(full_name: string) {
    const user = dbServices.CreateNewUser(full_name);
    if (user != undefined) {
      return user;
    }
    return undefined;
  }

  public static async UpdateSubscription(user_id: number, status: string) {
    const updatedUser = dbServices.UpdateUserSubscriptionStatus(user_id, status)
    if (updatedUser != null){
      return updatedUser
    }
    return null || undefined;
  }
}
