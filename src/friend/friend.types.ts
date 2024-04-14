import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Friend } from './friend.schema';
import { Meta } from 'src/common.types';

@InputType()
export class CreateFriendInput {
  @Field(() => ID)
  friendRequestId: string;
}

@ObjectType()
export class FriendSearch {
  @Field(() => [Friend])
  item: Friend[];

  @Field(() => Meta)
  meta: Meta;
}
