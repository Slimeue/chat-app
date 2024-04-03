import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChatRoomMemberInput {
  @Field()
  chatRoomId: string;
  @Field()
  userId: string;
}
