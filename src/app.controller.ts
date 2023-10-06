import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {MongodbService} from './mongodb/mongodb.service';
import {EventHubService} from './event_hub/event_hub.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly mongoDBService:MongodbService,private readonly eventHubService:EventHubService ) {}

  @Get()
  async getHello() {
   const data = await this.eventHubService.connectToEventHub();
   console.log(data);
   
    await this.mongoDBService.connectToMongoDB();
    return this.appService.getHello();
  }

}
