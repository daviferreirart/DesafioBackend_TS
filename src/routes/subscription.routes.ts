import { PrismaClient } from '@prisma/client'
import express from 'express'
import Rabbit from '../services/Rabbitmq'
import { rabbitmqHost } from '../services/RabbitVerifier'

const app = express()
const prisma = new PrismaClient()
const rabbit = new Rabbit()

app.post('/subscription', async (req, res) => {
    const { status_id, user_id } = req.body

    const subs = await prisma.subscription.create({
        data: {
            status_id,
            user_id
        }
    })
    rabbit.Receiver(rabbitmqHost,"SUBSCRIPTION_PURCHASED")
    return res.status(201).json(subs)
})

app.get('/subscription', async (req, res) => {
    const subs = await prisma.subscription.findMany()
    return res.status(200).json(subs)
})

export default app