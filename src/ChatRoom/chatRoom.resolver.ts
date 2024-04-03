import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ChatRoom } from './chatRoom.schema';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { ChatRoomService } from './chatRoom.service';
import { ChatRoomPaginationInput } from 'src/common.types';
import { ChatRoomSearch } from './chatRoom.types';

@Resolver(() => ChatRoom)
export class ChatRoomResolver {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Query(() => ChatRoom, { nullable: true })
  async chatRoomQuery(@CurrentUser() user: User) {
    //TODO implement this
    return user;
  }

  @ResolveField(() => ChatRoomSearch, { nullable: true })
  async chatRooms(
    @Args('input') input: ChatRoomPaginationInput,
    @CurrentUser() user: User,
  ) {
    //TODO implement this
    const { id } = user;
    if (!id) {
      throw new Error('User not found');
    }

    const room = await this.chatRoomService.search(input, id);
    return room;
  }
}
