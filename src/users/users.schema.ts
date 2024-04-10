import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 } from 'uuid';

@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field(() => ID)
  @Prop({ default: v4 })
  id: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field({ nullable: true })
  @Prop()
  password: string;

  @Field({ nullable: true })
  @Prop()
  name: string;

  @Field({ nullable: true })
  @Prop()
  accountProfileImageUrl: string;

  @Field({ nullable: true })
  @Prop()
  accountProfileImageName: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
