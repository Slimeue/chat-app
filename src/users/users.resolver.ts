import { Query, Resolver } from '@nestjs/graphql';
import { User } from './users.schema';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor() {}

  @Query(() => User)
  async userQuery(@CurrentUser() user: User) {
    return user;
  }
}
