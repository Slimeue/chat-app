import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from 'src/users/users.schema';

@InputType()
export class UserLogInInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

export type CustomRequest = Request & {
  userId?: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
