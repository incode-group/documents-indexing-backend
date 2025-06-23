import { Injectable } from '@nestjs/common';
import { AwsDynamoDBService } from 'src/libs/aws/services/aws-dynamo-db.service';
import { IDocument } from './data-types/inetraces/documents.interface';
import { BatchGetCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';

@Injectable()
export class DocumentsRepository {
  private readonly tableName = 'Documents';
  private readonly documentClient: DynamoDBDocumentClient;

  constructor(dynamoDBService: AwsDynamoDBService) {
    this.documentClient = dynamoDBService.getDocumentClient();
  }

  async create(payload: Omit<IDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<IDocument> {
    const now = new Date().toISOString();
    const document: IDocument = {
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      ...payload,
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        ...document,
      },
    });

    await this.documentClient.send(command);

    return document;
  }

  async findByIds({ ids }: { ids: string[] }): Promise<IDocument[]> {
    if (ids.length === 0) {
      return [];
    }
    const keys = ids.filter((el) => Boolean(el)).map((id) => ({ id })); // TODO: optimize this line
    const params = {
      RequestItems: {
        [this.tableName]: {
          Keys: keys,
        },
      },
    };

    const command = new BatchGetCommand(params);
    const response = await this.documentClient.send(command);

    return (response.Responses?.[this.tableName] as IDocument[]) ?? [];
  }
}
