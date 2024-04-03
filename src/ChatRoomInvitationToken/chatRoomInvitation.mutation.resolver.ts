import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoomInvitationToken } from './chatRoomInvitation.schema';
import { ChatRoomInvitationTokenService } from './chatRoomInvitation.service';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { CreateChatRoomInvitationTokenInput } from './chatRoomInvitation.types';

@Resolver(() => ChatRoomInvitationToken)
export class ChatRoomInvitationTokenMutationResolver {
  constructor(
    private readonly chatRoomInvitationTokenService: ChatRoomInvitationTokenService,
  ) {}

  @Mutation(() => ChatRoomInvitationToken)
  async creatChatRoomInvitationToken(
    @Args('input') input: CreateChatRoomInvitationTokenInput,
    @CurrentUser() user: User,
  ) {
    const { id } = user;
    const { chatRoomId } = input;
    if (!id) {
      throw new Error('User not found');
    }

    if (!input) {
      throw new Error('Chat room id is empty');
    }

    const chatRoomInvitationToken =
      await this.chatRoomInvitationTokenService.create(id, chatRoomId);

    if (!chatRoomInvitationToken) {
      throw new Error('Chat room invitation token not created');
    }

    return chatRoomInvitationToken;
  }
}
