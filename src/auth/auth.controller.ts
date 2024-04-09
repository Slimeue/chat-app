import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAutGuard } from './guards/local.guard';
import { UsersService } from 'src/users/users.service';
import { UserCreateInput } from 'src/users/users.types';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginResponse, UserLogInInput } from './auth.types';
import { JWT_SECRET } from 'src/config';
import { omit } from 'lodash';
import { IsPublic } from 'src/CustomDecorator/IsPublic.decorator';

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

    const user = (await this.authService.login(input)) as LoginResponse;
    return res.status(200).json(user);
  }
  @IsPublic()
  @Post('/signup')
  async signup(@Body() input: UserCreateInput, @Res() res: Response) {
    const user = await this.userService.create(input);

    return res.status(201).json(user);
  }
}
