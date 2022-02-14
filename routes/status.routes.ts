import {PrismaClient} from '@prisma/client'
import express from 'express'

const app = express()
const prisma = new PrismaClient()

app.post('/status',async (req,res)=>{
    const{name} = req.body

    const status = await prisma.status.create({
        data:{
            name:name
        }
    })
    return res.status(201).json(status).send()
})

app.get('/status',async (req,res)=>{
    const status = await prisma.status.findMany()
    res.status(200).json(status)
})

export default app