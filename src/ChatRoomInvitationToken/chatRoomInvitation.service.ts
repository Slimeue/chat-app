import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoomInvitationToken } from './chatRoomInvitation.schema';
import { Model } from 'mongoose';
import { makeToken } from './helper';
import { ChatRoomService } from 'src/ChatRoom/chatRoom.service';

@Injectable()
export class ChatRoomInvitationTokenService {
  constructor(
    @InjectModel(ChatRoomInvitationToken.name)
    private readonly chatRoomInvitationTokenModel: Model<ChatRoomInvitationToken>,
    private readonly chatRoomService: ChatRoomService,
  ) {}

  async create(id: string, roomId: string) {
    if (!id || !roomId) {
      throw new Error('Input is empty');
    }

    const chatRoom = await this.chatRoomService.findOne(roomId);

    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    const token = makeToken(12);

    const chatRoomInvitationToken = await new this.chatRoomInvitationTokenModel(
      {
        userId: id,
        chatRoomId: roomId,
        token,
      },
    );

    return chatRoomInvitationToken.save();
  }
  async findByToken(token: string) {
    const chatRoomInvitationToken =
      await this.chatRoomInvitationTokenModel.findOne({ token });

    return chatRoomInvitationToken;
  }
}
