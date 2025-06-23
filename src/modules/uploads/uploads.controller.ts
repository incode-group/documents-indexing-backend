import { Controller, Get, Query } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { GetPresignedUrlQueryDto } from './dtos/get-presigned-url.dto';

@Controller('uploads')
export class UploadsController {
    constructor(
        private readonly uploadsSevice: UploadsService
    ) {}

    @Get('pre-signed-url')
    getPreSignedUrl(
        @Query() query: GetPresignedUrlQueryDto
    ) {
        return this.uploadsSevice.getPreSignedUrl({...query});
    }
}
