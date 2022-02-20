import {PrismaClient} from '@prisma/client'
import express from 'express'

const app = express()
const prisma = new PrismaClient()

app.post('/events', async (req, res) => {
    const {type,idSubs } = req.body

    const evento = await prisma.eventHistory.create({
        data:{
            type:type,
            idSubs:idSubs
        }
    })
    return res.status(201).json(evento)

})

app.get('/events',async (req,res) =>{
    const event = await prisma.eventHistory.findMany()

    return res.status(200).json(event)
})



export default app;

