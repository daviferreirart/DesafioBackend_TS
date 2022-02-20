import express from 'express'
import status from './routes/status.routes'
import subscription from './routes/subscription.routes'
import events from './routes/eventHistory.routes'
import errorHandler from './error/handler'
import Verifier from './services/RabbitVerifier'


const verifier = new Verifier()
const app = express()
const err = errorHandler
app.use(express.json())

app.listen(3333, () => {
    console.log('Server UP')
})

app.use(status, subscription, events)
app.use(errorHandler)