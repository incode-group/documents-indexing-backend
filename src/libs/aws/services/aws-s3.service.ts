import { Injectable } from "@nestjs/common";
import {
    CopyObjectCommand,
    GetObjectCommand,
    ObjectCannedACL,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";

@Injectable()
export class AwsS3Service {
    private readonly urlExpireInSeconds: number = 3600; // 1 hour
    private readonly bucketName: string;
    private readonly region: string;

    private readonly s3Client: S3Client;

    constructor(private readonly configService: ConfigService) {
        this.bucketName = this.configService.get<string>("AWS_S3_BUCKET_NAME")!;
        this.region = this.configService.get<string>("AWS_REGION")!;
        this.s3Client = new S3Client({
            region: this.configService.get<string>("AWS_REGION")!,
            credentials: {
                accessKeyId: this.configService.get<string>(
                    "AWS_ACCESS_KEY_ID",
                )!,
                secretAccessKey: this.configService.get<string>(
                    "AWS_SECRET_ACCESS_KEY",
                )!,
            },
        });
    }

    async getPresignedPutUrl(
        key: string,
        expiresIn: number = this.urlExpireInSeconds,
        // acl: ObjectCannedACL = ObjectCannedACL.public_read,
    ): Promise<string> {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 3600);

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: `${key}`,
            // ACL: acl,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn });
    }

    async makeFilePermanent(key: string, newKey?: string): Promise<string> {
        const expiresAt = new Date("2199-12-31T23:59:59Z");

        const command = new CopyObjectCommand({
            Bucket: this.bucketName,
            CopySource: `/${this.bucketName}/${key}`,
            Key: newKey || key,
            Expires: expiresAt,
            MetadataDirective: "COPY",
        });

        await this.s3Client.send(command);

        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${
            newKey || key
        }`;
    }

    async getFile(key: string) {
        const s3Response = await this.s3Client.send(
            new GetObjectCommand({ Bucket: this.bucketName, Key: key }),
        );
        return s3Response.Body as Readable;
    }
}
