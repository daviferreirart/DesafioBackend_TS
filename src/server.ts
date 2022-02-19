import express from 'express'
import status from '../routes/status.routes'
import subscription from '../routes/subscription.routes'
import events from '../routes/eventHistory.routes'
import Rabbit from '../rabbitmq'


const app = express()

app.use(express.json())

app.listen(3333, () => {
    console.log('Server UP')
})

app.use(status, subscription, events)