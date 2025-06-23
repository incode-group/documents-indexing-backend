import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
