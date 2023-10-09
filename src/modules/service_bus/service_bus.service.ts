import { Injectable } from '@nestjs/common';
import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { MongodbService } from '../mongodb/mongodb.service';

type RecievedMessage = {
  type: string;
  message: string;
};

@Injectable()
export class ServiceBusService {
  constructor(private readonly mongodbService: MongodbService) {}
  async sendToServiceBusQueue(messages: RecievedMessage[]): Promise<void> {
    const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;

    const sbClient = new ServiceBusClient(connectionString);
    let sender: any;
    let batch: any;
    try {
      for (let i = 0; i < messages.length; i++) {
        sender = sbClient.createSender(messages[i].type);
        batch = await sender.createMessageBatch();
        const busMessage: ServiceBusMessage = {
          body: messages[i],
        };
        if (!batch.tryAddMessage(busMessage)) {
          await sender.sendMessages(batch);
          batch = await sender.createMessageBatch();
          if (!batch.tryAddMessage(busMessage)) {
            throw new Error('Message is too big to fit in a batch');
          }
        }
      }
      await sender.sendMessages(batch);
      console.log(`Sent a batch of messages to the queue`);
      await sender.close();
    } finally {
      await sbClient.close();
    }
  }

  async receiveFromServiceBusQueue(queueName: any) {
    const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;

    const sbClient = new ServiceBusClient(connectionString);
    const receiver = sbClient.createReceiver(queueName);
    const myMessageHandler = async (messageReceived: any) => {
      await this.mongodbService.connectToMongoDB();
      console.log(`Received message: ${messageReceived.body}`);
      await this.mongodbService.insertDocument(
        'nestjs',
        'data',
        messageReceived.body,
      );
      return messageReceived.body;
    };

    const myErrorHandler = async (error: any) => {
      console.log(error);
    };
    receiver.subscribe({
      processMessage: myMessageHandler,
      processError: myErrorHandler,
    });
  }
}
