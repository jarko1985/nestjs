import { Module } from '@nestjs/common';
import { ServiceBusService } from './service_bus.service';

@Module({
  providers: [ServiceBusService]
})
export class ServiceBusModule {}
