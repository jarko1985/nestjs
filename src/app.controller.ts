import { Controller, Get } from '@nestjs/common';
import { EventHubService } from './modules/event_hub/event_hub.service';
import { ServiceBusService } from './modules/service_bus/service_bus.service';

@Controller()
export class AppController {
  constructor(
    private readonly eventHubService: EventHubService,
    private readonly serviceBusService: ServiceBusService,
  ) {}

  @Get()
  async getHello() {
    await this.eventHubService.ReceiveFromEventHub();
    const queueNames = [
      'management_messages',
      'support_messages',
      'teams_messages',
    ];
    queueNames.forEach(async (queueName) => {
      await this.serviceBusService.receiveFromServiceBusQueue(queueName);
    });
  }
}
