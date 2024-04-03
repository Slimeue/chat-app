import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from './users.schema';

@Controller('users')
export class UsersController {
  constructor() {}

  @Get()
  async getUsersi(@CurrentUser() user: User) {
    return user;
  }
}
