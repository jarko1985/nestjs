import { Test, TestingModule } from '@nestjs/testing';
import { MongodbService } from '../mongodb/mongodb.service';
import { ServiceBusService } from './service_bus.service';

// Mock MongodbService
const mockMongodbService = {
  connectToMongoDB: jest.fn(),
  insertDocument: jest.fn(),
};

describe('ServiceBusService', () => {
  let service: ServiceBusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceBusService,
        {
          provide: MongodbService,
          useValue: mockMongodbService,
        },
      ],
    }).compile();

    service = module.get<ServiceBusService>(ServiceBusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendToServiceBusQueue', () => {
    it('should send messages to the queue', async () => {
      // Mock environment variable
      process.env.SERVICE_BUS_CONNECTION_STRING = 'mockConnectionString';

      // Mock sender and batch
      const mockSender = {
        createMessageBatch: jest.fn(),
        tryAddMessage: jest.fn(),
        sendMessages: jest.fn(),
        close: jest.fn(),
      };
      const mockBatch = {
        tryAddMessage: jest.fn(),
      };
      const mockClient = {
        createSender: jest.fn(() => mockSender),
        close: jest.fn(),
      };
      jest
        .spyOn(require('@azure/service-bus'), 'ServiceBusClient')
        .mockReturnValue(mockClient);

      // Prepare test data
      const messages = [
        { type: 'type1', message: 'Message 1' },
        { type: 'type2', message: 'Message 2' },
      ];

      // Execute the method
      await service.sendToServiceBusQueue(messages);

      // Assert interactions
      expect(mockSender.createMessageBatch).toHaveBeenCalledTimes(2);
      expect(mockSender.sendMessages).toHaveBeenCalledTimes(2);
      expect(mockSender.close).toHaveBeenCalledTimes(1);
      expect(mockClient.close).toHaveBeenCalledTimes(1);
    });

    it('should handle message too big error', async () => {
      // Mock environment variable
      process.env.SERVICE_BUS_CONNECTION_STRING = 'mockConnectionString';

      // Mock sender and batch
      const mockSender = {
        createMessageBatch: jest.fn(),
        tryAddMessage: jest.fn(),
        sendMessages: jest
          .fn()
          .mockRejectedValue(new Error('Message is too big to fit in a batch')),
        close: jest.fn(),
      };
      const mockBatch = {
        tryAddMessage: jest.fn(),
      };
      const mockClient = {
        createSender: jest.fn(() => mockSender),
        close: jest.fn(),
      };
      jest
        .spyOn(require('@azure/service-bus'), 'ServiceBusClient')
        .mockReturnValue(mockClient);

      // Prepare test data
      const messages = [
        { type: 'type1', message: 'Message 1' },
        { type: 'type2', message: 'Message 2' },
      ];

      // Execute the method
      await expect(service.sendToServiceBusQueue(messages)).rejects.toThrow(
        'Message is too big to fit in a batch',
      );

      // Assert interactions
      expect(mockSender.createMessageBatch).toHaveBeenCalledTimes(2);
      expect(mockSender.sendMessages).toHaveBeenCalledTimes(1);
      expect(mockSender.close).toHaveBeenCalledTimes(1);
      expect(mockClient.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('receiveFromServiceBusQueue', () => {
    // Note: This method relies heavily on external dependencies, and testing it requires integration testing.
    // It might be more suitable for an end-to-end or integration test.
  });
});
