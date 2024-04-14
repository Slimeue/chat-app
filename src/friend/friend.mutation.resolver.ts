import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Friend } from './friend.schema';
import { FriendService } from './friend.service';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { CreateFriendInput } from './friend.types';

@Resolver(() => Friend)
export class FriendMutationResolver {
  constructor(private readonly friendService: FriendService) {}

  @Mutation(() => Friend)
  async createFriend(
    @Args('input') input: CreateFriendInput,
    @CurrentUser() user: User,
  ) {
    const { id } = user;

    if (!id) {
      throw new Error('No Id Found');
    }

    if (!input) {
      throw new Error('No input found');
    }

    const friend = await this.friendService.create(id, input);

    return friend;
  }
}
