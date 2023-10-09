import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { EventHubService } from './modules/event_hub/event_hub.service';
import { ServiceBusService } from './modules/service_bus/service_bus.service';

// Mock EventHubService and ServiceBusService
const mockEventHubService = {
  ReceiveFromEventHub: jest.fn(),
};

const mockServiceBusService = {
  receiveFromServiceBusQueue: jest.fn(),
};

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: EventHubService,
          useValue: mockEventHubService,
        },
        {
          provide: ServiceBusService,
          useValue: mockServiceBusService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should call ReceiveFromEventHub and receiveFromServiceBusQueue', async () => {
      // Execute the method
      await controller.getHello();

      // Assert that methods were called
      expect(mockEventHubService.ReceiveFromEventHub).toHaveBeenCalledTimes(1);
      expect(
        mockServiceBusService.receiveFromServiceBusQueue,
      ).toHaveBeenCalledTimes(3);
      expect(
        mockServiceBusService.receiveFromServiceBusQueue,
      ).toHaveBeenCalledWith('management_messages');
      expect(
        mockServiceBusService.receiveFromServiceBusQueue,
      ).toHaveBeenCalledWith('support_messages');
      expect(
        mockServiceBusService.receiveFromServiceBusQueue,
      ).toHaveBeenCalledWith('teams_messages');
    });
  });
});
