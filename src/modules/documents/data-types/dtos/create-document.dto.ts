import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IDocument } from "../inetraces/documents.interface";

export class CreateDocumentBodyDto {
    @IsString()
    @IsNotEmpty({ message: "fileUrl is required." })
    fileUrl: string;

    @IsString()
    @IsNotEmpty({ message: "fileUrl is required." })
    fileName: string;
}

export class CreateDocumentPayloadDto extends CreateDocumentBodyDto {
    userId: string;
}

export class CreateDocumentResponseDto extends IDocument {}
