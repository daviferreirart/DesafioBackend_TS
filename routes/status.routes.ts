import { PrismaClient } from '@prisma/client'
import express from 'express'
import Rabbit from '../rabbitmq'

const app = express()
const prisma = new PrismaClient()
const rabbit = new Rabbit()

const rabbitmqHost = "amqp://192.168.106.128:5672"
app.post('/status', async (req, res) => {
    const { name } = req.body
    if (name === "subscribed") {
        let PURCHASED = "SUBSCRIPTION_PURCHASED"
        rabbit.Sender(rabbitmqHost, PURCHASED)
        const status = await prisma.status.create({
            data: {
                name: name
            }
        })
        return res.status(201).json(status).send()
    }
    return res.status(400).send()
})

app.get('/status', async (req, res) => {
    const status = await prisma.status.findMany()
    return res.status(200).json(status)
})

app.put('/status', async (req, res) => {
    const { id, name } = req.body

    if (name === "canceled") {
        let message_status = "SUBSCRIPTION_CANCELED"
        const status = await prisma.status.update({
            where: {
                id: id
            }, data: {
                name: name
            }
        })
        rabbit.Sender(rabbitmqHost, message_status)
        return res.status(201).json(status).send()
    }
    else if (name === "restarted"){
        let message_status = "SUBSCRIPTION_RESTARTED"
        const status = await prisma.status.update({
            where: {
                id: id
            }, data: {
                name: name
            }
        })
        rabbit.Sender(rabbitmqHost, message_status)
        return res.status(201).json(status).send()

    }
})

export default app