import { PrismaClient } from '@prisma/client'
import AppError from '../error/AppError'
import Rabbit from '../rabbitmq'

const prisma = new PrismaClient()
const rabbit = new Rabbit()

export default class Verifier {
    private rabbitmqHost = "amqp://192.168.106.128:5672"


    async createStatus(name: string) {
        if (name === "subscribed") {
            let PURCHASED = "SUBSCRIPTION_PURCHASED"
            rabbit.Sender(this.rabbitmqHost, PURCHASED)
            const status = await prisma.status.create({
                data: {
                    name: name
                }
            })
            return status
        }

        throw new AppError("Erro na operação")
    }
}