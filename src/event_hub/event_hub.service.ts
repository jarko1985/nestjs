import { Injectable } from '@nestjs/common';
import {EventHubProducerClient,EventHubConsumerClient} from '@azure/event-hubs'

@Injectable()
export class EventHubService{
private client: EventHubConsumerClient;
constructor(){
  this.client = new EventHubConsumerClient('namespace03','Endpoint=sb://namespace03.servicebus.windows.net/;SharedAccessKeyName=eventhubaccess01;SharedAccessKey=/obqPtaqumruTH+cQmVX3Fk3BOzfjeTR3+AEhCjj47o=;EntityPath=eventhub01');
}
async connectToEventHub(): Promise<void> {
    await this.client.getEventHubProperties()
  }
}

