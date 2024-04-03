import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './messages.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './messages.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}
  async create(input: CreateMessageInput, userId: string) {
    const { content, receiverId } = input;
    const message = await new this.messageModel({
      content,
      senderId: userId,
      receiverId,
    });
    return message.save();
  }

  async findMessagesByRoomId(receiverId: string) {
    if (!receiverId) {
      throw new Error('Room id is empty');
    }
    const messages = await this.messageModel.find({
      receiverId,
    });
    return messages;
  }
}
