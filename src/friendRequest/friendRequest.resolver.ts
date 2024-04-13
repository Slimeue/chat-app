import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FriendRequest } from './friendRequest.schema';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { FriendRequestSearch } from './friendRequest.types';
import { FriendRequestService } from './friendRequest.service';
import { FriendRequestPaginationInput } from 'src/common.types';

@Resolver(() => FriendRequest)
export class FriendRequestResolver {
  constructor(private readonly friendRequestService: FriendRequestService) {}
  @Query(() => FriendRequest, { nullable: true })
  async frienRequestQuery(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField(() => FriendRequestSearch)
  async friendRequestSearcy(
    @CurrentUser() user: User,
    @Args('input') input: FriendRequestPaginationInput,
  ) {
    const { id } = user;

    if (!id) {
      throw new Error('User not found');
    }

    const friendRequest = await this.friendRequestService.searchFriendRequest(
      id,
      {
        page: input.page ? input.page : 1,
        limit: input.limit ? input.limit : 10,
      },
    );

    return friendRequest;
  }
}
