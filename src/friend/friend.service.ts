import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from './friend.schema';
import { Model, PipelineStage } from 'mongoose';
import { CreateFriendInput, FriendSearch } from './friend.types';
import { User, UserDocument } from 'src/users/users.schema';
import { Mode } from 'fs';
import { FriendPaginationInput } from 'src/common.types';
import { UsersService } from 'src/users/users.service';
import { FriendRequestService } from 'src/friendRequest/friendRequest.service';
import { SetError } from 'src/helper';
import { isEmpty } from 'lodash';
import { ChatRoomService } from 'src/ChatRoom/chatRoom.service';
import { RoomType } from 'src/constants';
import { ChatRoomMemberService } from 'src/ChatRoomMember/chatRoomMember.service';

@Injectable()
export class FriendService {
  constructor(
    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,
    private readonly userService: UsersService,
    private readonly friendRequestService: FriendRequestService,
    private readonly chatRoomService: ChatRoomService,
    private readonly chatRoomMember: ChatRoomMemberService,
  ) {}

  async create(id: string, input: CreateFriendInput) {
    const { friendRequestId } = input;

    if (!id) {
      throw new Error('No Id Found');
    }

    if (!input) {
      throw new Error('No Input Found');
    }

    const friendReq = await this.friendRequestService.findOne(friendRequestId);

    if (isEmpty(friendReq)) {
      throw new HttpException('No friendRequest found', HttpStatus.NOT_FOUND);
    }

    const { requesterId } = friendReq;

    const foundRequester = await this.userService.findOneById(requesterId);

    try {
      const friendRequest =
        await this.friendRequestService.delete(friendRequestId);

      if (friendRequest) {
        console.log('Friend Request sucessfully deleted');
      }
    } catch (error) {
      SetError(error);
    }

    const { name } = foundRequester;

    const friend = await this.friendModel.create({
      friendName: name,
      friendId: foundRequester.id,
      userId: id,
    });

    const chatRoom = await this.chatRoomService.create(
      id,
      {
        name: RoomType.FRIEND,
      },
      RoomType.FRIEND,
    );

    await this.chatRoomMember.create({
      chatRoomId: chatRoom.id,
      userId: id,
    });

    await this.chatRoomMember.create({
      chatRoomId: chatRoom.id,
      userId: requesterId,
    });

    return friend;
  }

  async search(id: string, input: FriendPaginationInput) {
    const { page, limit } = input;

    const aggregate: PipelineStage[] = [];

    const match: PipelineStage.Match = {
      $match: {
        userId: id,
      },
    };

    const facet: PipelineStage.Facet = {
      $facet: {
        meta: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
          {
            $addFields: {
              page,
              limit,
            },
          },
        ],
        docs: [
          {
            $skip: limit * (page - 1),
          },
          {
            $limit: limit,
          },
        ],
      },
    };

    aggregate.push(match);
    aggregate.push(facet);

    const result = await this.friendModel.aggregate(aggregate).exec();

    console.log(result);
  }
}
