import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@opensearch-project/opensearch';

@Injectable()
export class AwsOpenSearchService {
  private readonly client: Client;

  constructor(configService: ConfigService) {
    this.client = new Client({
      node: configService.get<string>('OPENSEARCH_NODE_URL')!,
      auth: {
        username: configService.get<string>('OPENSEARCH_USERNAME')!,
        password: configService.get<string>('OPENSEARCH_PASSWORD')!,
      },
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Indexes a document in OpenSearch.
   * @param doc The document to index.
   */
  async indexDocument(doc: { filename: string; content: string; id: string }) {
    await this.client.index({
      index: 'documents',
      body: {
        id: doc.id,
        filename: doc.filename,
        content: doc.content,
        timestamp: new Date(),
      },
    });
    console.log('Document indexed successfully:', doc.filename); // TODO: use logger
  }

  /**
   * Searches for documents in OpenSearch.
   * @param query The search query.
   * @returns An array of documents matching the query.
   * TODO: should be in separate service
   */
  async searchDocuments(query: string) {
    const response = await this.client.search({
      index: 'documents',
      body: {
        query: {
          match: { content: query },
        },
        highlight: {
          fields: {
            content: {},
          },
        },
      },
    });

    // return response
    return response.body.hits.hits.map((hit: any) => ({ ...hit._source, highlights: hit.highlight }));
  }
}
