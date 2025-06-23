import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsDynamoDBService {
  private readonly client: DynamoDBClient;
  private readonly documentClient: DynamoDBDocumentClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new DynamoDBClient({
      region: configService.get('AWS_REGION')!,
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
    this.documentClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  /**
   * Returns the DynamoDB client.
   */
  getClient(): DynamoDBClient {
    return this.client;
  }

  /**
   * Returns the DynamoDB Document client.
   */
  getDocumentClient(): DynamoDBDocumentClient {
    return this.documentClient;
  }
}
