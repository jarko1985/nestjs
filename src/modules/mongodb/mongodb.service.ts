import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongodbService {
  private client: MongoClient;

  async connectToMongoDB(): Promise<void> {
    this.client = new MongoClient(`${process.env.MONGODB_URI}`, {});
    await this.client.connect();
    console.log('DataBase Connected');
  }

  async insertDocument(
    databaseName: string,
    collectionName: string,
    document: any,
  ): Promise<void> {
    const db = this.client.db(databaseName);
    const collection = db.collection(collectionName);
    await collection.insertOne(document);
  }
}
