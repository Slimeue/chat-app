import { Field, InputType } from '@nestjs/graphql';
import * as GraphQlUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload';
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
