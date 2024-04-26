import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ChatApp');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(6060);

  logger.log(`Running on http://localhost:6060/graphql`);
}
bootstrap();
