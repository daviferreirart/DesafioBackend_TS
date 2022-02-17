import express from 'express'
import status from '../routes/status.routes'
import subscription from '../routes/subscription.routes'
import events from '../routes/eventHistory.routes'
import Rabbit from '../rabbitmq'


const app = express()
const host = "amqp://192.168.56.101:5672"

app.use(express.json())

const rabbit = new Rabbit()
rabbit.Receiver(host)

app.listen(3333, () => {
    console.log('Server UP')
})

app.use(status, subscription, events)