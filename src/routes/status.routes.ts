import { PrismaClient } from '@prisma/client'
import express from 'express'
import AppError from '../error/AppError'
import Rabbit from '../services//rabbitServices/Rabbitmq'
import Verifier from '../services/rabbitServices/RabbitVerifier'

const app = express()
const prisma = new PrismaClient()

app.post('/status', async (req, res) => {
    const { name } = req.body
    const status = await Verifier.CreateStatus(name)
    return res.status(201).json(status)

})

app.get('/status', async (req, res) => {
    const status = await prisma.status.findMany()
    return res.status(200).json(status)
})

app.put('/status', async (req, res) => {
    const { id, name } = req.body

    const status = await Verifier.VerifyStatus(id, name)
    return res.status(200).json(status)
})

export default app