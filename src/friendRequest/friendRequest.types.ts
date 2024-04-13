import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FriendRequest } from './friendRequest.schema';
import { Meta } from 'src/common.types';

@InputType()
export class CreateFriendRequestInput {
  @Field()
  requestedToId: string;
}

@ObjectType()
export class FriendRequestSearch {
  @Field(() => [FriendRequest], { nullable: true })
  item: FriendRequest[];

  @Field(() => Meta, { nullable: true })
  meta: Meta;
}
