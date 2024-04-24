import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Message } from './messages.schema';
import {
  CreateMessageInput,
  CreateMessageSubscriptionInput,
} from './messages.types';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { MessagesService } from './messages.service';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { SUBSCIRTION_EVENTS } from 'src/constants';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'graphql-upload';
import { CommonService } from 'src/common.service';
import { isEmpty } from 'lodash';
@Resolver(() => Message)
export class MessagesMutationResolver {
  constructor(
    private readonly commonService: CommonService,
    private readonly messageService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}
  @Mutation(() => Message)
  async createMessage(
    @Args('input') input: CreateMessageInput,
    @Args('images', { type: () => [GraphQLUpload], nullable: true })
    images: FileUpload[],
    @CurrentUser()
    user: User,
  ) {
    const { id } = user;

    let uploads: FileUpload[];

    if (!isEmpty(images)) {
      uploads = await Promise.all(images);
    }

    const message = await this.messageService.create(input, id, uploads);
    await this.pubSub.publish(
      `${SUBSCIRTION_EVENTS.MESSAGE_CREATED}:${input.receiverId}`,
      {
        messageCreated: message,
      },
    );
    return message;
  }

  @Mutation(() => Message)
  async addImages(
    @Args('images', { type: () => [GraphQLUpload] }) images: FileUpload[],
    @CurrentUser() user: User,
  ) {
    const { id } = user;

    const files = await Promise.all(images);

    const result = await this.commonService.uploadMultipleImage(files, id);
    //#TODO implement message sending with multiple images if not empty

    return null;
  }
}
