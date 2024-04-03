import { forwardRef, Module } from '@nestjs/common';
import { ChatRoomMember, ChatRoomMemberSchema } from './chatRoomMember.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomMemberResolver } from './chatRoomMember.resolver';
import { ChatRoomMemberService } from './chatRoomMember.service';
import { ChatRoomMemberMutationResolver } from './chatRoomMember.mutation.resolver';
import { ChatRoomInvitationTokenModule } from 'src/ChatRoomInvitationToken/chatRoomInvitation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatRoomMember.name,
        schema: ChatRoomMemberSchema,
      },
    ]),
    forwardRef(() => ChatRoomInvitationTokenModule),
  ],
  providers: [
    ChatRoomMemberResolver,
    ChatRoomMemberService,
    ChatRoomMemberMutationResolver,
  ],
  exports: [ChatRoomMemberService, MongooseModule],
})
export class ChatRoomMemberModule {}
