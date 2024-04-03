import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoomMember } from './chatRoomMember.schema';
import { Model } from 'mongoose';
import { CreateChatRoomMemberInput } from './chatRoomMember.types';

@Injectable()
export class ChatRoomMemberService {
  constructor(
    @InjectModel(ChatRoomMember.name)
    private readonly chatRoomMemberModel: Model<ChatRoomMember>,
  ) {}
  async create(input: CreateChatRoomMemberInput) {
    if (!input) {
      throw new Error('Input is empty');
    }
    const chatRoomMember = await new this.chatRoomMemberModel({
      ...input,
    });

    return chatRoomMember.save();
  }

  async findAllByUserId(userId: string) {
    if (!userId) {
      throw new Error('User id is empty');
    }
    return await this.chatRoomMemberModel.find({
      userId,
    });
  }
}
