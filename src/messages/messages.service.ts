import { Injectable } from '@nestjs/common';
import { CreateMessageInput } from './messages.types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './messages.schema';
import { CommonService } from 'src/common.service';
import { isEmpty } from 'lodash';
import { ChatRoomService } from 'src/ChatRoom/chatRoom.service';
import { MessagePaginationInput } from 'src/common.types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    private readonly commonService: CommonService,
    private readonly chatRoomService: ChatRoomService,
    private readonly userService: UsersService,
  ) {}
  async create(
    input: CreateMessageInput,
    userId: string,
    userName: string,
    images?: any,
  ) {
    const { content, receiverId } = input;

    const receiverName = await this.userService.findOneById(receiverId);

    const message = await new this.messageModel({
      content,
      senderId: userId,
      senderName: userName,
      receiverId,
    });

    const chatRoom = await this.chatRoomService.findOne(receiverId);

    if (!isEmpty(images)) {
      const resultUpload = await this.commonService.uploadMultipleImage(
        images,
        userId,
      );

      for (const image of resultUpload) {
        const media_type =
          image.mimetype.split('/')[0] === 'image'
            ? chatRoom.media_image_url.push(image.url)
            : image.mimetype.split('/')[0] === 'video'
              ? chatRoom.media_videoes_url.push(image.url)
              : chatRoom.media_file_url.push(image.url);

        message.media_url.push(image.url);
        message.media_name.push(image.fileName);
      }
    }

    await chatRoom.save();
    return message.save();
  }

  async findMessagesByRoomId(input: MessagePaginationInput) {
    const { receiverId, limit = 10 } = input;
    if (!receiverId) {
      throw new Error('Room id is empty');
    }
    const messages = await this.messageModel
      .find({
        receiverId,
      })
      .limit(limit);
    return messages;
  }
}
