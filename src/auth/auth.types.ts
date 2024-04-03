import { Field, InputType } from '@nestjs/graphql';
import { Request } from 'express';

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
