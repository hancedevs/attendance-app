import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { docGen } from '@/doc/docgen';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useWebSocketAdapter(new IoAdapter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  docGen(app);
  await app.listen(3000);
}
bootstrap();
