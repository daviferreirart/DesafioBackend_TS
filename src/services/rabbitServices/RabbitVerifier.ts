import { PrismaClient, Status } from '@prisma/client'
import AppError from '../../error/AppError'
import Rabbit from './Rabbitmq'
export const rabbitmqHost = "amqp://localhost:5672"

const prisma = new PrismaClient()
const rabbit = new Rabbit()
export default class Verifier {

    public static async CreateStatus(name: string): Promise<Status | undefined> {
        if (name === "subscribed") {
            const message_status = "SUBSCRIPTION_PURCHASED"
            rabbit.Sender(rabbitmqHost, message_status)
            const status = await prisma.status.create({
                data: {
                    status_name: name
                }
            })

            return status
        }
        throw new AppError("Erro na operação")
    }

    public static async VerifyStatus(id: number, name: string): Promise<Status | undefined> {
        if (name === "canceled") {
            const message_status = "SUBSCRIPTION_CANCELED"
            const status = await prisma.status.update({
                where: {
                    id: id
                }, data: {
                    status_name: name
                }
            })
            rabbit.Sender(rabbitmqHost, message_status)
            return status
        }
        else if (name === "restarted") {
            const message_status = "SUBSCRIPTION_RESTARTED"
            const status = await prisma.status.update({
                where: {
                    id: id
                }, data: {
                    status_name: name
                }
            })
            rabbit.Sender(rabbitmqHost, message_status)
            return status

        }
        throw new AppError("Erro na operação")
    }
}