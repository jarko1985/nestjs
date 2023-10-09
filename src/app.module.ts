import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventHubModule } from './modules/event_hub/event_hub.module';
import { ServiceBusModule } from './modules/service_bus/service_bus.module';
import { MongodbModule } from './modules/mongodb/mongodb.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventHubModule,
    ServiceBusModule,
    MongodbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
