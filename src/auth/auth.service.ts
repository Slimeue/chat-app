import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserLogInInput } from './auth.types';
import { comparePasswords } from 'src/common.service';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';
import { omit } from 'lodash';

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
    const { email, password: inputPassword } = input;

    if (!email) {
      throw new Error('Email is required');
    }

    const user = await this.userService.findOne(email);

    let token: string;
    if (!isEmpty(user)) {
      const isPasswordMatch = await comparePasswords(
        inputPassword,
        user.password,
      );

      if (!isPasswordMatch) {
        throw new Error('Password is incorrect');
      }

      const payload = { user };
      const cleanUser = omit(payload?.user?.toObject(), ['password']);
      const toUser = { user: cleanUser };
      token = await this.jwtService.signAsync(toUser);
    }

    return {
      token,
      user,
    };
  }
}
