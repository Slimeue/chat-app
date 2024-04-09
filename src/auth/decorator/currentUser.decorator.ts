import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JWT_SECRET } from 'src/config';
import { User } from 'src/users/users.schema';
import { verify } from 'jsonwebtoken';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const isSubscription = ctx.getContext()?.req?.connectionParams;
    if (isSubscription) {
      const { authorization } = isSubscription;
      const authArr = authorization.split(' ');
      const token = authArr[1];

      const foundUser = verify(token, JWT_SECRET);

      const { user } = foundUser as any;
      return user as User;
    }
    return ctx.getContext()?.req?.user as User;
  },
);
