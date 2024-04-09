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

@Resolver(() => Message)
export class MessagesMutationResolver {
  constructor(
    private readonly messageService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}
  @Mutation(() => Message)
  async createMessage(
    @Args('input') input: CreateMessageInput,
    @CurrentUser() user: User,
  ) {
    const { id } = user;
    const message = await this.messageService.create(input, id);
    await this.pubSub.publish(
      `${SUBSCIRTION_EVENTS.MESSAGE_CREATED}:${input.receiverId}`,
      {
        messageCreated: message,
      },
    );
    return message;
  }
}
