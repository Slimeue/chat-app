import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { UserCreateInput } from './users.types';
import { generateSalt, hashPassword } from 'src/common.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
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

  async findOne(email: string) {
    console.log(email);
    if (!email) {
      throw new Error('Email is required');
    }

    return this.userModel.findOne({ email });
  }
}
