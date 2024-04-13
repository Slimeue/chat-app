import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './friendRequest.schema';
import { FriendRequestService } from './friendRequest.service';
import { FriendRequestResolver } from './friendRequest.resolver';
import { FriendRequestMutationResolver } from './friendRequest.mutation.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FriendRequest.name,
        schema: FriendRequestSchema,
      },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [],
  providers: [
    FriendRequestService,
    FriendRequestResolver,
    FriendRequestMutationResolver,
  ],
  exports: [],
})
export class FriendRequestModule {}
