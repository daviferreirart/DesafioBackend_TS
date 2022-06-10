import amqp from "amqplib/callback_api";

export default class Rabbit {
  Receiver(host: string, queueName: string): any {
    amqp.connect(host, (connErr, connection) => {
      if (connErr) {
        throw connErr;
      }
      connection.createChannel((channelErr, channel) => {
        if (channelErr) {
          throw channelErr;
        }
        channel.assertQueue(queueName);
        channel.consume(
          queueName,
          (msg) => {
            console.log(`Message received:${msg?.content.toString()}`);
          },
          { noAck: true }
        );
      });
    });
  }

  Sender(host: string, queue: string): any {
    amqp.connect(host, (connErr, connection) => {
      if (connErr) {
        throw connErr;
      }
      connection.createChannel((channelError, channel) => {
        if (channelError) {
          throw channelError;
        }
        channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(queue));
        console.log(`Message send: ${queue}`);
      });
    });
  }
}
