import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAutGuard } from './guards/local.guard';
import { UsersService } from 'src/users/users.service';
import { UserCreateInput } from 'src/users/users.types';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginResponse, UserLogInInput } from './auth.types';
import { JWT_SECRET } from 'src/config';
import { IsPublic } from 'src/CustomDecorator/IsPublic.decorator';
import { omit } from 'lodash';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @IsPublic()
  @UseGuards(LocalAutGuard)
  @Post('/login')
  async login(@Body() input: UserLogInInput, @Res() res: Response) {
    console.log(JWT_SECRET);
    if (!input.email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await this.authService.login(input);
    const cleanUser = omit(user.user.toObject(), ['password']);
    const payload = { token: user.token, user: cleanUser } as LoginResponse;
    return res.status(200).json(payload);
  }
  @IsPublic()
  @Post('/signup')
  async signup(@Body() input: UserCreateInput, @Res() res: Response) {
    const user = await this.userService.create(input);

    return res.status(201).json(user);
  }
}
