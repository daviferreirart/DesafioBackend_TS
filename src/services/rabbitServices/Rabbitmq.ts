import amqp from "amqplib/callback_api";

export const rabbitmqHost = "amqp://localhost:5672"
export default class Rabbit {
  private async Receiver(host: string, queueName: string): Promise<any> {
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
            console.log(`Message receiveqd:${msg?.content.toString()}`);
          },
          { noAck: true }
        );
      });
    });
  }

  public async Sender(host: string, queue: string): Promise<any> {
    try{
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
    catch(error){
      throw ("Error while trying to connect")
    }
  }
}
