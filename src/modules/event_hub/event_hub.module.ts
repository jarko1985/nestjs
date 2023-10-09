import { Module } from '@nestjs/common';
import { EventHubService } from './event_hub.service';
import { ServiceBusService } from '../service_bus/service_bus.service';
import { MongodbService } from '../mongodb/mongodb.service';

@Module({
  providers: [EventHubService, ServiceBusService, MongodbService],
  exports: [EventHubService],
})
export class EventHubModule {}
