import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from './users.schema';
import { FileUpload } from 'graphql-upload';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { UserAddProfileInput } from './users.types';
import { HttpException, HttpStatus } from '@nestjs/common';
@Resolver(() => User)
export class UsersMutationResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async addProfileImage(
    @Args('image', { type: () => GraphQLUpload })
    image: Promise<FileUpload>,
    @CurrentUser() user: User,
  ) {
    const { id } = user;

    const profilePic = await image;

    if (!profilePic) {
      throw new HttpException('No Image found', HttpStatus.BAD_REQUEST);
    }

    if (Array.isArray(profilePic)) {
      throw new HttpException(
        "Can't upload multiple image",
        HttpStatus.BAD_REQUEST,
      );
    }

    const upload = await this.usersService.uploadProfilePic(profilePic, id);
    return upload;
  }
}
