import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UsersMutationResolver } from './users.mutation.resolver';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => FirebaseModule),
    forwardRef(() => AppModule),
  ],
  providers: [UsersResolver, UsersService, UsersMutationResolver],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
