import amqp from 'amqplib/callback_api'

export default class Rabbit {
    Receiver(host: string): any {
        amqp.connect(host, (connErr, connection) => {
            if (connErr) {
                throw connErr
            }
            connection.createChannel((channelErr, channel) => {
                if (channelErr) {
                    throw channelErr
                }
                const queue = 'kiko'
                const payload = "SUBSCRIBED"
                channel.assertQueue(queue)
                channel.consume(queue, (msg) => {
                    console.log(`Message received :${msg?.content.toString()}`)
                }, { noAck: true }
                )
            })
        })

    }

    Sender(host: string): any {
        amqp.connect(host, (connErr, connection) => {
            if (connErr) {
                throw connErr
            }
            connection.createChannel((channelError, channel) => {
                if (channelError) {
                    throw channelError
                }
                const QUEUE = 'codingtest'
                channel.assertQueue(QUEUE);
                // Step 4: Send message to queue
                channel.sendToQueue(QUEUE, Buffer.from('hello from its coding time'));
                console.log(`Message send ${QUEUE}`);
            })
        })
    }
}