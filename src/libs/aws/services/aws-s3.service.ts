import { Injectable } from '@nestjs/common';
import { CopyObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class AwsS3Service {
  private readonly urlExpireInSeconds: number = 3600; // 1 hour
  private readonly bucketName: string;
  private readonly region: string;

  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
    this.region = this.configService.get<string>('AWS_REGION')!;
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  /**
   * Generates a pre-signed URL for uploading a file to S3.
   * @param key The S3 object key.
   * @param expiresIn The expiration time in seconds.
   * @returns The pre-signed URL.
   */
  async getPresignedPutUrl(key: string, expiresIn: number = this.urlExpireInSeconds): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${key}`,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Uploads a file to S3.
   * @param key The S3 object key.
   * @param file The file to upload.
   * @returns The URL of the uploaded file.
   */
  async makeFilePermanent(key: string, newKey?: string): Promise<string> {
    const command = new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: `/${this.bucketName}/${key}`,
      Key: newKey || key,
      MetadataDirective: 'COPY',
    });

    await this.s3Client.send(command);

    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${newKey || key}`;
  }

  /**
   * Retrieves a file from S3 by key.
   */
  async getFile(key: string): Promise<Readable> {
    const s3Response = await this.s3Client.send(new GetObjectCommand({ Bucket: this.bucketName, Key: key }));
    return s3Response.Body as Readable;
  }
}
