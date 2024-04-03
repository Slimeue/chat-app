import { forwardRef, Module } from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from './chatRoom.schema';
import { ChatRoomResolver } from './chatRoom.resolver';
import { ChatRoomMutationResolver } from './chatRoom.mutation.resolver';
import { ChatRoomMemberModule } from 'src/ChatRoomMember/chatRoomMember.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatRoom.name,
        schema: ChatRoomSchema,
      },
    ]),
    forwardRef(() => ChatRoomMemberModule),
  ],
  providers: [ChatRoomService, ChatRoomResolver, ChatRoomMutationResolver],
  exports: [ChatRoomService, MongooseModule],
})
export class ChatRoomModule {}
