import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('file-upload')
@UseGuards(JwtAuthGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('لم يتم رفع أي ملف');
    }

    return this.fileUploadService.uploadFile(file, folder);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // حد أقصى 10 ملفات
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('لم يتم رفع أي ملفات');
    }

    return this.fileUploadService.uploadMultipleFiles(files, folder);
  }

  @Get('list')
  async listFiles(
    @Query('folder') folder?: string,
    @Query('subFolder') subFolder?: string,
  ) {
    return this.fileUploadService.listFiles(folder, subFolder);
  }

  @Get('info/:fileName')
  async getFileInfo(
    @Param('fileName') fileName: string,
    @Query('folder') folder?: string,
  ) {
    return this.fileUploadService.getFileInfo(fileName, folder);
  }

  @Get('url/:fileName')
  async getFileUrl(
    @Param('fileName') fileName: string,
    @Query('folder') folder?: string,
  ) {
    return this.fileUploadService.getFileUrl(fileName, folder);
  }

  @Delete(':fileName')
  async deleteFile(
    @Param('fileName') fileName: string,
    @Query('folder') folder?: string,
  ) {
    return this.fileUploadService.deleteFile(fileName, folder);
  }
}
