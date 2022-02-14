import express from 'express'
import status from '../routes/status.routes'
import subscription  from '../routes/subscription.routes'

const app = express()


app.use(express.json())

app.listen(3333,()=>{
    console.log('Server UP')
})

app.use(status,subscription)