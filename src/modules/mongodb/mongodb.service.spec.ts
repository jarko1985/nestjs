import { Test, TestingModule } from '@nestjs/testing';
import { MongodbService } from './mongodb.service';

describe('MongodbService', () => {
  let service: MongodbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongodbService],
    }).compile();

    service = module.get<MongodbService>(MongodbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('connectToMongoDB', () => {
    it('should connect to MongoDB', async () => {
      // Mock the environment variable
      process.env.MONGODB_URI = 'mockMongoDBUri';

      // Execute the method
      await service.connectToMongoDB();

      // Assert that the client is connected
      expect(service['client']).toBeDefined();
    });
  });

  describe('insertDocument', () => {
    it('should insert a document into the specified collection', async () => {
      // Mock the client and collection methods
      const mockInsertOne = jest.fn();
      const mockCollection = { insertOne: mockInsertOne };
      service['client'] = {
        db: jest.fn(() => ({ collection: jest.fn(() => mockCollection) })),
      } as any;

      // Execute the method
      await service.insertDocument('testDB', 'testCollection', {
        key: 'value',
      });

      // Assert that the document is inserted
      expect(mockInsertOne).toHaveBeenCalledWith({ key: 'value' });
    });
  });
});
