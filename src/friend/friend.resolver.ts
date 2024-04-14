import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Friend } from './friend.schema';
import { FriendService } from './friend.service';
import { FriendSearch } from './friend.types';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { FriendPaginationInput } from 'src/common.types';
import { SetError } from 'src/helper';

@Resolver(() => Friend)
export class FriendResolver {
  constructor(private readonly friendService: FriendService) {}

  @Query(() => Friend)
  async friendQuery(@CurrentUser() user: User) {
    return user;
  }
  @ResolveField(() => FriendSearch)
  async search(
    @Args('input') input: FriendPaginationInput,
    @CurrentUser() user: User,
  ) {
    const { id } = user;

    if (!id) {
      SetError('No Id Found');
    }

    if (!input) {
      SetError('No Input Found');
    }

    const search = await this.friendService.search(id, {
      page: input.page ? input.page : 1,
      limit: input.limit ? input.limit : 10,
    });

    return search;
  }
}
