import { Injectable } from '@nestjs/common';
import { DocumentsRepository } from './documents.repository';
import { CreateDocumentPayloadDto, CreateDocumentResponseDto } from './data-types/dtos/create-document.dto';
import { UploadsService } from '../uploads/uploads.service';
import { KafkaService } from 'src/libs/kafka/kafka.service';
import { AwsOpenSearchService } from 'src/libs/aws/services/aws-opensearch.service';
import { FindDocumentsByUserPayloadDto } from './data-types/dtos/find-documents.dto';
import { IDocument } from './data-types/inetraces/documents.interface';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly documentsRepository: DocumentsRepository,
    private readonly uploadsService: UploadsService,
    private readonly kafkaService: KafkaService,
    private readonly awsOpenSearchService: AwsOpenSearchService,
  ) {}

  /**
   * Creates a new document. Also sends a message to Kafka and indexes the document in OpenSearch.
   * @param payload The document creation payload.
   * @returns The created document.
   */
  async create(payload: CreateDocumentPayloadDto): Promise<CreateDocumentResponseDto> {
    const { fileUrl, fileName, ...data } = payload;

    const uploadedFileUrl = await this.uploadsService.makeFilePermanent(fileUrl, `uploads/documents`);

    const document = await this.documentsRepository.create({
      ...data,
      fileUrl: uploadedFileUrl,
      name: fileName,
    });

    await this.kafkaService.send('documents-topic', {
      path: uploadedFileUrl,
      id: document.id,
    });

    return document;
  }

  /**
   * Finds documents by user ID and search query.
   * @param payload The search payload containing user ID and search query.
   * @returns The found documents.
   */
  async find(payload: FindDocumentsByUserPayloadDto): Promise<IDocument[]> {
    // TODO: fix inderface

    const { userId, search } = payload;

    const osResult = await this.awsOpenSearchService.searchDocuments(search || '');

    // return osResult as any;
    const ids = osResult.map((item) => item.id);

    const documents = await this.documentsRepository.findByIds({ ids }).then((docs) => {
      return docs.filter((doc) => doc.userId === userId);
    });

    return documents.map((doc) => {
      const osDoc = osResult.find((item) => item.id === doc.id);
      return {
        ...doc,
        content: osDoc?.content || '',
        highlights: osDoc?.highlights || [],
      };
    });
  }
}
