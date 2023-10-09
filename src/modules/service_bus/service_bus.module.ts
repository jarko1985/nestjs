import { Module } from '@nestjs/common';
import { ServiceBusService } from './service_bus.service';
import { MongodbService } from '../mongodb/mongodb.service';

@Module({
  providers: [ServiceBusService, MongodbService],
  exports: [ServiceBusService],
})
export class ServiceBusModule {}
