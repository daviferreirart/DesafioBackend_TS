import { PrismaClient } from '@prisma/client'
import express from 'express'
import Rabbit from '../rabbitmq'

const app = express()
const prisma = new PrismaClient()

app.post('/subscription', async (req, res) => {
    const { status_id } = req.body

    const subs = await prisma.subscription.create({
        data: {
            status_id: status_id
        }
    })
    return res.status(201).json(subs)
})

app.get('/subscription', async (req, res) => {
    const rabbit = new Rabbit()
    const subs = await prisma.subscription.findMany()
    return res.status(200).json(subs)
})

export default app