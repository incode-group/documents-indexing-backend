import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { CreateDocumentBodyDto } from "./data-types/dtos/create-document.dto";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { FindDocumentsQueryDto } from "./data-types/dtos/find-documents.dto";

@Controller("documents")
export class DocumentsController {
    constructor(
        private readonly documentsService: DocumentsService,
    ) {}

    @UseGuards(JwtGuard)
    @Post()
    create(@Body() body: CreateDocumentBodyDto, @Req() req: any) {
        return this.documentsService.create({
            ...body,
            userId: req.user.userId,
        });
    }

    @UseGuards(JwtGuard)
    @Get()
    find(@Query() query: FindDocumentsQueryDto, @Req() req: any) { // TODO: use decorator to get user
        return this.documentsService.find({
            userId: req.user.userId,
            ...query,
        });
    }
}
