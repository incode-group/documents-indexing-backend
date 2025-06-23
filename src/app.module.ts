import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import dotenvSchema from './config/dotenv/dotenv.schema';
import { getEnvFilePath } from './config/dotenv/utils';
import { AwsModule } from './libs/aws/aws.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { KafkaModule } from './libs/kafka/kafka.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: dotenvSchema,
      envFilePath: [...getEnvFilePath()],
    }),
    AwsModule,
    DocumentsModule,
    UploadsModule,
    KafkaModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
