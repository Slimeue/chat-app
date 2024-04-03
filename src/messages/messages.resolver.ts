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
  async messages(@Args('receiverId') receiverId: string) {
    //todo implement this
    if (!receiverId) {
      throw new Error('Room ID is required');
    }
    const messages = await this.messageService.findMessagesByRoomId(receiverId);
    return messages;
  }

  @Subscription(() => Message)
  async messageCreated(@Context() { payload }: { payload: Message }) {
    return await this.pubSub.asyncIterator(SUBSCIRTION_EVENTS.MESSAGE_CREATED);
  }
}
