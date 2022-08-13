import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ActionType } from '@enums/action.enum';

@Schema({
  versionKey: false,
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
})
export class Transaction extends Document {
  @Prop({ required: true, unique: true, ref: 'User' })
  user: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true, enum: ActionType })
  action: ActionType;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.plugin(mongoosePaginate);
