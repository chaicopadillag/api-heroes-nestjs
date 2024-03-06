import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './config/configuration';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  const { port } = app.get<ConfigType<typeof configuration>>(configuration.KEY);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.enableCors({ origin: '*' });

  await app.listen(port, () => {
    logger.debug(`Application is running on PORT: ${port}`);
  });
}
bootstrap();
