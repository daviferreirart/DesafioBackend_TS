import {PrismaClient} from '@prisma/client'
import express from 'express'
import { send } from 'process'

const app = express()
const prisma = new PrismaClient()

app.post('/subscription',async(req,res)=>{
    const{status_id} = req.body
    //const date = new Date().getTimezoneOffset()
    const subs = await prisma.subscription.create({
        data:{
            status_id:status_id
        }
    })
    res.status(201).json(subs)
})

app.get('/subscription',async (req, res) =>{
    const subs = await prisma.subscription.findMany()
    res.status(200).json(subs)
})

export default app