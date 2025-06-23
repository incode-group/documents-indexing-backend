import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AwsS3Service } from 'src/libs/aws/services/aws-s3.service';
import { GetPresignedUrlPayloadDto } from './dtos/get-presigned-url.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  /**
   * Generates a pre-signed URL for uploading a file to S3.
   * The file will be stored in the 'temp/uploads' directory with a random UUID as the filename.
   * @param payload The payload containing the file extension.
   * @returns A promise that resolves to the pre-signed URL.
   */
  getPreSignedUrl(payload: GetPresignedUrlPayloadDto): Promise<string> {
    const { extension } = payload;

    const filename = `${randomUUID()}.${extension}`;
    const key = `temp/uploads/${filename}`;

    return this.awsS3Service.getPresignedPutUrl(key);
  }

  /**
   * Makes a temporary file permanent in S3.
   * @param url The pre-signed URL of the temporary file.
   * @param path The S3 path where the file should be moved.
   * @returns The new S3 URL of the permanent file.
   */
  async makeFilePermanent(url: string, path?: string): Promise<string> {
    const temporaryKey = new URL(url).pathname.slice(1);
    const fileName = temporaryKey.split('/').pop();
    if (!fileName) {
      throw new BadRequestException('Invalid file name in URL');
    }

    const newKey = path ? `${path}/${fileName}` : fileName;

    return this.awsS3Service.makeFilePermanent(temporaryKey, newKey);
  }
}
