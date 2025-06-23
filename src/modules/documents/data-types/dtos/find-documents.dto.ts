import { IsOptional, IsString } from "class-validator";

export class FindDocumentsQueryDto {
    @IsOptional()
    @IsString()
    search?: string;
}

export class FindDocumentsByUserPayloadDto extends FindDocumentsQueryDto {
    userId: string;
}
