import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';
@Schema({
  timestamps: true,
  timeseries: {
    timeField: 'createdAt',
    metaField: 'meta',
    granularity: 'seconds',
  },
  expireAfterSeconds: 60,
})
@ObjectType()
export class ChatRoomInvitationToken {
  @Field()
  @Prop({ required: true, default: v4 })
  id: string;

  @Field()
  @Prop({ required: true })
  chatRoomId: string;

  @Field()
  @Prop({ required: true })
  userId: string;

  @Field()
  @Prop({ required: true })
  token: string;
}

export const ChatRoomInvitationTokenSchema = SchemaFactory.createForClass(
  ChatRoomInvitationToken,
);
