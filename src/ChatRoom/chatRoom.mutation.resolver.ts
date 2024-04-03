import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChatRoom } from './chatRoom.schema';
import { ChatRoomService } from './chatRoom.service';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { CreateChatRoomInput } from './chatRoom.types';
import { ChatRoomMemberService } from 'src/ChatRoomMember/chatRoomMember.service';

@Resolver(() => ChatRoom)
export class ChatRoomMutationResolver {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatRoomMember: ChatRoomMemberService,
  ) {}

  @Mutation(() => ChatRoom)
  async createChatRoom(
    @CurrentUser() user: User,
    @Args('input') input: CreateChatRoomInput,
  ) {
    const { id } = user;

    if (!id) {
      throw new Error('User not found');
    }

    if (!input) {
      throw new Error('Input is empty');
    }

    const chatRoom = await this.chatRoomService.create(id, input);

    const { id: roomId, ownerId } = chatRoom;

    if (!roomId || !ownerId) {
      throw new Error('Chat room not created');
    }

    const chatRoomMember = await this.chatRoomMember.create({
      chatRoomId: roomId,
      userId: ownerId,
    });

    if (!chatRoomMember) {
      throw new Error('Chat room member not created');
    }
    return chatRoom;
  }
}
