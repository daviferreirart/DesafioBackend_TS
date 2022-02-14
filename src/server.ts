import express from 'express'
import status from '../routes/status.routes'

const app = express()


app.use(express.json())

app.listen(3333,()=>{
    console.log('Server UPP')
})

app.use(status)