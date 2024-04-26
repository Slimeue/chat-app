import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, FriendSchema } from './friend.schema';
import { FriendMutationResolver } from './friend.mutation.resolver';
import { FriendResolver } from './friend.resolver';
import { UsersModule } from 'src/users/users.module';
import { FriendService } from './friend.service';
import { FriendRequestModule } from 'src/friendRequest/friendRequest.module';
import { ChatRoomModule } from 'src/ChatRoom/chatRoom.module';
import { ChatRoomMemberModule } from 'src/ChatRoomMember/chatRoomMember.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Friend.name,
        schema: FriendSchema,
      },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => FriendRequestModule),
    forwardRef(() => ChatRoomModule),
    forwardRef(() => ChatRoomMemberModule),
  ],
  controllers: [],
  providers: [FriendMutationResolver, FriendResolver, FriendService],
  exports: [],
})
export class FriendModule {}
