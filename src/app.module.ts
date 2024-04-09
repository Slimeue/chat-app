import { Module } from '@nestjs/common';
import { MessageGatewayModule } from './MessageGateway/message.gateway.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { JWT_SECRET, MONGO_URL } from './config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PubsubModule } from './pubsub/pubsub.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MessagesModule } from './messages/messages.module';
import { verify } from 'jsonwebtoken';
import { get } from 'lodash';
import { ChatRoomModule } from './ChatRoom/chatRoom.module';
import { ChatRoomMemberModule } from './ChatRoomMember/chatRoomMember.module';
import { ChatRoomInvitationTokenModule } from './ChatRoomInvitationToken/chatRoomInvitation.module';
@Module({
  imports: [
    MessageGatewayModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        autoSchemaFile: 'src/schema.gql',
        context: ({ req, connection }) =>
          connection ? { req: { headers: connection.context } } : { req },
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        playground: false,
        fieldResolverEnhancers: ['guards'],
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context: any) => {
              const { extra } = context;

              const authorization: string | null = get(
                context,
                'connectionParams.authorization',
                '',
              );
              if (!authorization) {
                throw new Error('Missing auth token!');
              }
              const authArr = authorization.split(' ');

              const token = authArr[1];
              if (!token) {
                throw new Error('Forbidden!');
              }
              const foundUser = verify(token, JWT_SECRET);
              const { user } = foundUser as any;

              if (!user) {
                throw new Error('Forbidden!');
              }
              extra.request.headers = {
                ...extra.request.headers,
                authorization: `Bearer ${token}`,
              };

              return {
                req: {
                  ...context?.extra?.request,
                  ...context?.connectionParams,
                },
              };
            },
          },
        },
      }),
    }),
    MongooseModule.forRoot(MONGO_URL),
    UsersModule,
    AuthModule,
    PubsubModule,
    MessagesModule,
    ChatRoomModule,
    ChatRoomMemberModule,
    ChatRoomInvitationTokenModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
