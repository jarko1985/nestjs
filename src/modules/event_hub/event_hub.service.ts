import { Injectable } from '@nestjs/common';
import {
  EventHubProducerClient,
  earliestEventPosition,
  EventHubConsumerClient,
} from '@azure/event-hubs';
import { ContainerClient } from '@azure/storage-blob';
import { BlobCheckpointStore } from '@azure/eventhubs-checkpointstore-blob';
import { ServiceBusService } from '../service_bus/service_bus.service';

@Injectable()
export class EventHubService {
  constructor(private readonly serviceBusService: ServiceBusService) {}
  async SendToEventHub(): Promise<void> {
    const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
    const eventHubName = process.env.EVENT_HUB_NAME;
    const producer = new EventHubProducerClient(connectionString, eventHubName);
    const batch = await producer.createBatch();
    batch.tryAdd({ body: 'First Event' });
    batch.tryAdd({ body: 'Second Event' });
    batch.tryAdd({ body: 'Third Event' });
    await producer.sendBatch(batch);
    console.log('Seccessfull Sent');

    await producer.close();
  }

  async ReceiveFromEventHub(): Promise<any> {
    const connectionString = process.env.EVENT_HUB_CONNECTION_STRING;
    const eventHubName = process.env.EVENT_HUB_NAME;
    const consumerGroup = process.env.EVENT_HUB_CONSUMER_GROUP;
    const storageConnectionString = process.env.CONTAINER_CONNECTION_STRING;
    const containerName = process.env.CONTAINER_NAME;

    const containerClient = new ContainerClient(
      storageConnectionString,
      containerName,
    );
    const checkpointStore = new BlobCheckpointStore(containerClient);
    const consumerClient = new EventHubConsumerClient(
      consumerGroup,
      connectionString,
      eventHubName,
      checkpointStore,
    );
    const subscription = consumerClient.subscribe(
      {
        processEvents: async (events, context) => {
          if (events.length === 0) {
            console.log(
              `No events received within wait time. Waiting for next interval`,
            );
            return;
          }
          console.log(events.map((el) => el.body));
          for (const event of events) {
            console.log(
              `Received event: '${event.body}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`,
            );
            return this.serviceBusService.sendToServiceBusQueue(event.body);
          }
          // Update the checkpoint.
          await context.updateCheckpoint(events[events.length - 1]);
        },

        processError: async (err, context) => {
          console.log(`Error : ${err}`);
        },
      },
      { startPosition: earliestEventPosition },
    );
  }
}
