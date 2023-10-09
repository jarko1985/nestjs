import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Data extends Document {
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  message: string;
}

export const DataSchema = SchemaFactory.createForClass(Data);
