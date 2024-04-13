import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class Friend {
  @Field(() => ID)
  @Prop()
  id: string;

  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  friendId: string;

  @Field()
  @Prop()
  name: string;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
