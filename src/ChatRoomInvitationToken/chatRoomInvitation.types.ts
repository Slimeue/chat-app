import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TokenInput {
  @Field()
  token: string;
}

@InputType()
export class CreateChatRoomInvitationTokenInput {
  @Field()
  chatRoomId: string;
}
