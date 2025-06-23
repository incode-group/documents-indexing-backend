import { Module } from '@nestjs/common';
import { AwsCognitoService } from './services/aws-cognito.service';
import { AwsS3Service } from './services/aws-s3.service';
import { AwsDynamoDBService } from './services/aws-dynamo-db.service';
import { AwsOpenSearchService } from './services/aws-opensearch.service';

@Module({
  providers: [AwsCognitoService, AwsS3Service, AwsDynamoDBService, AwsOpenSearchService],
  exports: [AwsCognitoService, AwsS3Service, AwsDynamoDBService, AwsOpenSearchService],
})
export class AwsModule {}
