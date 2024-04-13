import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FriendRequest } from './friendRequest.schema';
import { CreateFriendRequestInput } from './friendRequest.types';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { FriendRequestService } from './friendRequest.service';

@Resolver(() => FriendRequest)
export class FriendRequestMutationResolver {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Mutation(() => FriendRequest)
  async createFriendRequest(
    @Args('input') input: CreateFriendRequestInput,
    @CurrentUser() user: User,
  ) {
    const { id, name } = user;

    if (!id) {
      throw new Error('No ID found');
    }

    console.log(user);

    const friendRequest = await this.friendRequestService.create(
      id,
      name,
      input,
    );

    return friendRequest;
  }
}
