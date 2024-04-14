import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FriendRequest } from './friendRequest.schema';
import {
  CreateFriendRequestInput,
  DeleteFriendRequestInput,
} from './friendRequest.types';
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

    const friendRequest = await this.friendRequestService.create(
      id,
      name,
      input,
    );

    return friendRequest;
  }

  @Mutation(() => FriendRequest)
  async deleteFriendRequest(@Args('input') input: DeleteFriendRequestInput) {
    const { id } = input;
    if (!id) {
      throw new Error('No ID found');
    }

    const friendRequest = await this.friendRequestService.delete(id);

    return friendRequest;
  }
}
