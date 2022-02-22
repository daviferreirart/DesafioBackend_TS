/*
  Warnings:

  - You are about to drop the column `idSubs` on the `EventHistory` table. All the data in the column will be lost.
  - Added the required column `subscription_id` to the `EventHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventHistory" DROP CONSTRAINT "EventHistory_idSubs_fkey";

-- AlterTable
ALTER TABLE "EventHistory" DROP COLUMN "idSubs",
ADD COLUMN     "subscription_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "EventHistory" ADD CONSTRAINT "EventHistory_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
