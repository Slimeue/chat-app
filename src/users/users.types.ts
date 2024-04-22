import { Field, InputType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
@InputType()
export class UserCreateInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;
}

@InputType()
export class UserAddProfileInput {
  @Field(() => GraphQLUpload)
  image: FileUpload;
}
