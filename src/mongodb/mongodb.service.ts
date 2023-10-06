import { Injectable } from '@nestjs/common';
import {MongoClient} from 'mongodb';
@Injectable()
export class MongodbService {
    private client : MongoClient;
  

    async connectToMongoDB(): Promise<void> {
        this.client = new MongoClient('mongodb+srv://jarko85:1234@cluster1.thbcqab.mongodb.net/?retryWrites=true&w=majority');
        await this.client.connect();
        console.log("DataBase Connected");
        
      }

    // async insertDocument(databaseName:string,collectionName:string,document:any):Promise<void>{
    //     const db = this.client.db(databaseName);
    //     const collection = db.collection(collectionName);
    //     await collection.insertOne(document);
    // }
}
