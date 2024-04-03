import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ChatRoom } from './chatRoom.schema';
import { Meta } from 'src/common.types';

@InputType()
export class CreateChatRoomInput {
  @Field()
  name: string;
}

@ObjectType()
export class ChatRoomSearch {
  @Field(() => [ChatRoom])
  item: [ChatRoom];

  @Field()
  meta: Meta;
}
