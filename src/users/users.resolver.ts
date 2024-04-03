import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './users.schema';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => User)
  async userQuery(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField(() => [User], { nullable: true })
  async users(@CurrentUser() user: User) {
    const { id } = user;
    if (!id) {
      throw new Error('User not found');
    }

    const users = await this.userService.findAllExceptCurrentUser(id);
    return users;
  }
}
