import { Module } from '@nestjs/common';
import { EventHubService } from './event_hub.service';

@Module({
  providers: [EventHubService],
  exports:[EventHubService]
})
export class EventHubModule {}
