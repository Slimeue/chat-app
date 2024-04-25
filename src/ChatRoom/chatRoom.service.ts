import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './chatRoom.schema';
import { Model } from 'mongoose';
import { CreateChatRoomInput } from './chatRoom.types';
import { ChatRoomPaginationInput } from 'src/common.types';
import { ChatRoomMemberService } from 'src/ChatRoomMember/chatRoomMember.service';
import { RoomType } from 'src/constants';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
    private readonly chatRoomMemberService: ChatRoomMemberService,
  ) {}

  async create(id: string, input: CreateChatRoomInput, type?: RoomType) {
    const chatRoom = await new this.chatRoomModel({
      ...input,
      ownerId: id,
      roomType: type,
    });

    return chatRoom.save();
  }

  async findOne(id: string) {
    return await this.chatRoomModel.findOne({
      id,
    });
  }

  async search(input: ChatRoomPaginationInput, userId: string) {
    const { limit, page } = input;

    const chatRoomMember =
      await this.chatRoomMemberService.findAllByUserId(userId);

    if (!chatRoomMember) {
      throw new Error('Chat room member not found');
    }
    const chatRoomIds = chatRoomMember.map((member) => member.chatRoomId);

    const aggregate = this.chatRoomModel.aggregate([
      {
        $match: { id: { $in: chatRoomIds } },
      },
      {
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
            // {
            //   $skip: limit * (page - 1),
            // },
            {
              $limit: limit,
            },
          ],
        },
      },
    ]);
    const result = await aggregate.exec();

    const item = result[0].docs;
    const meta = result[0].meta[0];

    return { item, meta };
  }
}
