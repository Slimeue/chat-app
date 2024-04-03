import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@Schema({ timestamps: true })
@ObjectType()
export class Message {
  @Field()
  @Prop({ required: true, default: v4 })
  id: string;

  @Field()
  @Prop()
  content: string;

  @Field(() => String, { nullable: true })
  @Prop()
  senderId: string;

  @Field(() => String, { nullable: true })
  @Prop()
  receiverId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
