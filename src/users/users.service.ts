import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { UserCreateInput } from './users.types';
import { CommonService, generateSalt, hashPassword } from 'src/common.service';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly commonService: CommonService,
  ) {}

  async create(input: UserCreateInput) {
    if (!input.email) {
      throw new Error('Email is required');
    }

    if (!input.password) {
      throw new Error('Password is required');
    }

    const salt = await generateSalt(3);
    const hashedPassword = await hashPassword(input.password, salt);

    const user = new this.userModel({
      ...input,
      password: hashedPassword,
    });

    return user.save();
  }

  async findOneById(id: string) {
    const user = await this.userModel.findOne({ id });
    return user;
  }

  async findOne(email: string) {
    console.log(email);
    if (!email) {
      throw new Error('Email is required');
    }

    return this.userModel.findOne({ email });
  }

  async findAllExceptCurrentUser(id: string) {
    return this.userModel.find({ id: { $ne: id } });
  }

  async uploadProfilePic(image: FileUpload, userId: string): Promise<User> {
    const { url, fileName, mimetype } = await this.commonService.uploadFile(
      image,
      userId,
    );

    const user = await this.findOneById(userId);

    const updatedUser = await this.userModel.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          accountProfileImageUrl: url,
          accountProfileImageName: fileName,
        },
      },
      {
        new: true,
      },
    );

    return updatedUser;
  }
}
