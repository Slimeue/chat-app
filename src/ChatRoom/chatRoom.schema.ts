import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';
@Schema({ timestamps: true })
@ObjectType()
export class ChatRoom {
  @Field()
  @Prop({ required: true, default: v4 })
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  ownerId: string;
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
