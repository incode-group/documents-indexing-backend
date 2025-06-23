import { IsNotEmpty, Matches } from 'class-validator';

export class GetPresignedUrlQueryDto {
  @IsNotEmpty()
  @Matches(/^(pdf|doc)$/, {
    message: 'Only one file extension is allowed (pdf, doc)',
  })
  extension: string;
}

export class GetPresignedUrlPayloadDto extends GetPresignedUrlQueryDto {}
