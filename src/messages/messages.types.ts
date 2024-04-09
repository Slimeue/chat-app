import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field()
  content: string;

  @Field()
  senderId: string;

  @Field()
  receiverId: string;
}

@InputType()
export class CreateMessageSubscriptionInput {
  @Field()
  receiverId: string;
}
