import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';
@ObjectType()
@Schema({ timestamps: true })
export class FriendRequest {
  @Field(() => ID)
  @Prop({ required: true, default: v4 })
  id: string;

  @Field()
  @Prop({ required: true })
  requesterId: string;

  @Field()
  @Prop({ required: true })
  requestedToId: string;

  @Field()
  @Prop()
  requesterName: string;

  @Field()
  @Prop()
  requestedToName: string;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
