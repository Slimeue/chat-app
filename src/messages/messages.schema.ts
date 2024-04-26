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

  @Field(() => [String])
  @Prop()
  media_url: string[];

  @Field(() => [String])
  @Prop()
  media_name: string[];

  @Field(() => String, { nullable: false })
  @Prop()
  senderId: string;

  @Field({ nullable: false })
  @Prop()
  senderName: string;

  @Field(() => String, { nullable: false })
  @Prop()
  receiverId: string;

  @Field({ nullable: false })
  @Prop()
  receiverName: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
