import { Resolver } from '@nestjs/graphql';
import { ChatRoomInvitationToken } from './chatRoomInvitation.schema';

@Resolver(() => ChatRoomInvitationToken)
export class ChatRoomInvitationTokenResolver {
  constructor() {}
}
