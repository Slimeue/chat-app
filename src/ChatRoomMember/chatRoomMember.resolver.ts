import { Resolver } from '@nestjs/graphql';
import { ChatRoomMember } from './chatRoomMember.schema';

@Resolver(() => ChatRoomMember)
export class ChatRoomMemberResolver {
  constructor() {}
}
