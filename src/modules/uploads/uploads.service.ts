import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AwsS3Service } from "src/libs/aws/services/aws-s3.service";
import { GetPresignedUrlPayloadDto } from "./dtos/get-presigned-url.dto";

@Injectable()
export class UploadsService {
    constructor(
        private readonly awsS3Service: AwsS3Service,
    ) {}

    getPreSignedUrl(payload: GetPresignedUrlPayloadDto): Promise<string> {
        const { extension } = payload;

        const filename = `${randomUUID()}.${extension}`;
        const key = `temp/uploads/${filename}`;

        return this.awsS3Service.getPresignedPutUrl(key);
    }

    async makeFilePermanent(url: string, path?: string): Promise<string> {
        const temporaryKey = new URL(url).pathname.slice(1);
        const fileName = temporaryKey.split("/").pop();
        if (!fileName) {
            throw new BadRequestException("Invalid file name in URL");
        }

        const newKey = path ? `${path}/${fileName}` : fileName;

        return this.awsS3Service.makeFilePermanent(temporaryKey, newKey);
    }
}
