import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './users.schema';
import { FileUpload } from 'graphql-upload';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
@Resolver(() => User)
export class UsersMutationResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async addProfileImage(
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
    @CurrentUser() user: User,
  ) {
    const { id } = user;
    const upload = await this.usersService.uploadProfilePic(image, id);
    return upload;
  }
}
