import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoomMember } from './chatRoomMember.schema';
import { ChatRoomMemberService } from './chatRoomMember.service';
import { CreateChatRoomMemberInput } from './chatRoomMember.types';
import { ChatRoomInvitationTokenService } from 'src/ChatRoomInvitationToken/chatRoomInvitation.service';
import { TokenInput } from 'src/ChatRoomInvitationToken/chatRoomInvitation.types';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';

@Resolver(() => ChatRoomMember)
export class ChatRoomMemberMutationResolver {
  constructor(
    private readonly chatRoomMemberService: ChatRoomMemberService,
    private readonly chatRoomInvitationTokenService: ChatRoomInvitationTokenService,
  ) {}

  @Mutation(() => ChatRoomMember)
  async createChatRoomMember(@Args('input') input: CreateChatRoomMemberInput) {
    if (!input) {
      throw new Error('Input is empty');
    }
    const chatRoomMember = await this.chatRoomMemberService.create(input);
    return chatRoomMember;
  }

  @Mutation(() => ChatRoomMember)
  async acceptInvitation(
    @Args('input') input: TokenInput,
    @CurrentUser() user: User,
  ) {
    const { id: userId } = user;
    const { token } = input;

    if (!token) {
      throw new Error('Token is empty');
    }

    const chatRoomInvitationToken =
      await this.chatRoomInvitationTokenService.findByToken(token);

    if (!chatRoomInvitationToken) {
      throw new Error('Token not found');
    }

    const { id: roomId } = chatRoomInvitationToken;

    if (!userId || !roomId) {
      throw new Error('User or room not found');
    }

    const chatRoomMember = await this.chatRoomMemberService.create({
      userId,
      chatRoomId: roomId,
    });

    if (!chatRoomMember) {
      throw new Error('Chat room member not created');
    }

    return chatRoomMember;
  }
}
