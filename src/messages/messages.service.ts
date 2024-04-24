import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './messages.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './messages.schema';
import { CommonService } from 'src/common.service';
import { isEmpty } from 'lodash';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    private readonly commonService: CommonService,
  ) {}
  async create(input: CreateMessageInput, userId: string, images?: any) {
    const { content, receiverId } = input;

    const message = await new this.messageModel({
      content,
      senderId: userId,
      receiverId,
    });

    if (!isEmpty(images)) {
      const resultUpload = await this.commonService.uploadMultipleImage(
        images,
        userId,
      );

      for (const image of resultUpload) {
        message.media_url.push(image.url);
        message.media_name.push(image.fileName);
      }
    }

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
