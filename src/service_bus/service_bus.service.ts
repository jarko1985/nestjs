import { Injectable } from '@nestjs/common';
import {ServiceBusClient} from '@azure/service-bus'
@Injectable()
export class ServiceBusService {
    private client: ServiceBusClient;
    constructor(){
        this.client = new ServiceBusClient('Endpoint=sb://servicebus01.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=GBOXX2RwcusD9Eaak/cMFhwN1gXbbnOGq+ASbAFVtLw=');
    }
}
