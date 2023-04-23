import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['randomString_djaksjdk'], //encrypt session message
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //block extra properties sended in object if not defined in dto
    })
  );
  await app.listen(3000);
}
bootstrap();
