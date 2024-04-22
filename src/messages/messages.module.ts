import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { Message, MessageSchema } from './messages.schema';
import { MessagesResolver } from './messages.resolver';
import { PubsubModule } from 'src/pubsub/pubsub.module';
import { MessagesMutationResolver } from './messages.mutation.resolver';
import { MessagesService } from './messages.service';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    PubsubModule,
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    forwardRef(() => AppModule),
  ],
  controllers: [],
  providers: [MessagesResolver, MessagesMutationResolver, MessagesService],
  exports: [],
})
export class MessagesModule {}
