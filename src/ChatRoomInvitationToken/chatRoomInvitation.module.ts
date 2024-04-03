import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatRoomInvitationToken,
  ChatRoomInvitationTokenSchema,
} from './chatRoomInvitation.schema';
import { ChatRoomInvitationTokenService } from './chatRoomInvitation.service';
import { ChatRoomInvitationTokenResolver } from './chatRoomInvitation.resolver';
import { ChatRoomInvitationTokenMutationResolver } from './chatRoomInvitation.mutation.resolver';
import { ChatRoomModule } from 'src/ChatRoom/chatRoom.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatRoomInvitationToken.name,
        schema: ChatRoomInvitationTokenSchema,
      },
    ]),
    forwardRef(() => ChatRoomModule),
  ],
  providers: [
    ChatRoomInvitationTokenService,
    ChatRoomInvitationTokenResolver,
    ChatRoomInvitationTokenMutationResolver,
  ],
  exports: [ChatRoomInvitationTokenService, MongooseModule],
})
export class ChatRoomInvitationTokenModule {}
