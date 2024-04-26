import {
  Args,
  Context,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Message } from './messages.schema';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/pubsub/pubsub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { SUBSCIRTION_EVENTS } from 'src/constants';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.schema';
import { MessagesService } from './messages.service';
import { CreateMessageSubscriptionInput } from './messages.types';
import { MessagePaginationInput } from 'src/common.types';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    @Inject(PUB_SUB)
    private readonly pubSub: RedisPubSub,
    private readonly messageService: MessagesService,
  ) {}

  @Query(() => Message, { nullable: true })
  async messageQuery(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField(() => [Message], { nullable: true })
  async messages(@Args('input') input: MessagePaginationInput) {
    //todo implement this
    const { receiverId } = input;
    if (!receiverId) {
      throw new Error('Room ID is required');
    }
    const messages = await this.messageService.findMessagesByRoomId(input);
    return messages;
  }

  @Subscription(() => Message)
  async messageCreated(
    @CurrentUser() user: User,
    @Args('receiverId') receiverId: CreateMessageSubscriptionInput,
  ) {
    console.log('receiverId', receiverId.receiverId);

    return await this.pubSub.asyncIterator(
      `${SUBSCIRTION_EVENTS.MESSAGE_CREATED}:${receiverId.receiverId}`,
    );
  }
}
