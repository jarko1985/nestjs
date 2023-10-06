import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventHubModule } from './event_hub/event_hub.module';
import { ServiceBusModule } from './service_bus/service_bus.module';
import { MongodbModule } from './mongodb/mongodb.module';

@Module({
  imports: [EventHubModule, ServiceBusModule, MongodbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
