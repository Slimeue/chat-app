import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';
@Schema({ timestamps: true })
@ObjectType()
export class ChatRoomMember {
  @Field()
  @Prop({ required: true, default: v4 })
  id: string;

  @Field()
  @Prop({ required: true })
  chatRoomId: string;

  @Field()
  @Prop({ required: true })
  userId: string;
}
export const ChatRoomMemberSchema =
  SchemaFactory.createForClass(ChatRoomMember);
