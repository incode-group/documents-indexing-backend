import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix('v1/api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
