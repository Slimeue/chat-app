import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { UserLogInInput } from './auth.types';
import { comparePasswords } from 'src/common.service';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    const isMatched = await comparePasswords(password, user.password);

    if (user && isMatched) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(input: UserLogInInput) {
    const { email, password } = input;

    if (!email) {
      throw new Error('Email is required');
    }

    const user = await this.userService.findOne(email);

    let jwtToken: string;
    if (!isEmpty(user)) {
      const isPasswordMatch = await comparePasswords(password, user.password);

      if (!isPasswordMatch) {
        throw new Error('Password is incorrect');
      }

      const payload = { user };
      jwtToken = await this.jwtService.signAsync(payload);
    }

    return {
      jwtToken,
      user,
    };
  }
}
