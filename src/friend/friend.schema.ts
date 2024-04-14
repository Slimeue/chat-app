import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@ObjectType()
@Schema({ timestamps: true })
export class Friend {
  @Field(() => ID)
  @Prop({ default: v4 })
  id: string;

  @Field({ nullable: true })
  @Prop()
  userId: string; //requestedToId

  @Field()
  @Prop()
  friendId: string; //requesterId

  @Field()
  @Prop()
  friendName: string;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
