import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { AwsModule } from 'src/libs/aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [UploadsService],
  controllers: [UploadsController],
  exports: [UploadsService] 
})
export class UploadsModule {}
