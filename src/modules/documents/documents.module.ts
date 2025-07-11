import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentsRepository } from './documents.repository';
import { UploadsModule } from '../uploads/uploads.module';
import { AwsModule } from 'src/libs/aws/aws.module';
import { KafkaModule } from 'src/libs/kafka/kafka.module';
import { DocumentsConsumerService } from './documents.consumer';

@Module({
  imports: [UploadsModule, AwsModule, KafkaModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentsRepository, DocumentsConsumerService],
})
export class DocumentsModule {}
