import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { Readable } from 'stream';
import { AwsOpenSearchService } from 'src/libs/aws/services/aws-opensearch.service';
import { AwsS3Service } from 'src/libs/aws/services/aws-s3.service';
import { KafkaService } from 'src/libs/kafka/kafka.service';

// TODO: use logger & move logic to separate service
@Injectable()
export class DocumentsConsumerService implements OnModuleInit {
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly osService: AwsOpenSearchService,
    private readonly s3Client: AwsS3Service,
  ) {
    this.kafka = this.kafkaService.getClient();
    this.consumer = this.kafka.consumer({ groupId: 'document-consumer' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'documents-topic',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const payload = JSON.parse((message.value || {}).toString());
        const { path, id } = payload;
        const key = new URL(path).pathname.slice(1);

        const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
          return new Promise((resolve, reject) => {
            const chunks: any[] = [];

            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks)));
          });
        };

        try {
          const fileStream = await this.s3Client.getFile(key);
          const fileBuffer = await streamToBuffer(fileStream);

          let content = '';

          if (key.endsWith('.pdf')) {
            const parsed = await pdfParse(fileBuffer);
            content = parsed.text;
          } else if (key.endsWith('.docx')) {
            const result = await mammoth.extractRawText({
              buffer: fileBuffer,
            });
            content = result.value;
          } else {
            console.warn(`Unsupported file type: ${key}`);
            return;
          }

          await this.osService.indexDocument({
            id,
            filename: key,
            content,
          });
          console.log(`Indexed document: ${key} finished.`); // TODO: use logger
        } catch (err) {
          console.error('Failed to process file from S3:', JSON.stringify(err));
        }
      },
    });
  }
}
