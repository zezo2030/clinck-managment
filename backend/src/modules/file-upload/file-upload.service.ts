import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileUploadService {
  private readonly uploadPath: string;
  private readonly maxFileSize: number;
  private readonly allowedTypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get('FILE_UPLOAD_PATH', './uploads');
    this.maxFileSize = this.configService.get('MAX_FILE_SIZE', 10485760); // 10MB
    this.allowedTypes = this.configService.get('ALLOWED_FILE_TYPES', 'image/jpeg,image/png,application/pdf').split(',');
    
    // إنشاء مجلد التحميل إذا لم يكن موجوداً
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    const directories = [
      this.uploadPath,
      path.join(this.uploadPath, 'consultations'),
      path.join(this.uploadPath, 'consultations', 'images'),
      path.join(this.uploadPath, 'consultations', 'files'),
      path.join(this.uploadPath, 'consultations', 'documents'),
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string = 'consultations') {
    // التحقق من حجم الملف
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`حجم الملف يتجاوز الحد المسموح (${this.maxFileSize / 1024 / 1024}MB)`);
    }

    // التحقق من نوع الملف
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`نوع الملف غير مسموح. الأنواع المسموحة: ${this.allowedTypes.join(', ')}`);
    }

    // تحديد نوع المجلد الفرعي
    let subFolder = 'files';
    if (file.mimetype.startsWith('image/')) {
      subFolder = 'images';
    } else if (file.mimetype === 'application/pdf') {
      subFolder = 'documents';
    }

    // إنشاء اسم فريد للملف
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const fullPath = path.join(this.uploadPath, folder, subFolder, fileName);

    // حفظ الملف
    fs.writeFileSync(fullPath, file.buffer);

    // إرجاع معلومات الملف
    return {
      fileName,
      originalName: file.originalname,
      path: fullPath,
      url: `/uploads/${folder}/${subFolder}/${fileName}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date(),
    };
  }

  async uploadMultipleFiles(files: Express.Multer.File[], folder: string = 'consultations') {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileName: string, folder: string = 'consultations') {
    // تحديد نوع المجلد الفرعي من امتداد الملف
    const extension = path.extname(fileName).toLowerCase();
    let subFolder = 'files';
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      subFolder = 'images';
    } else if (extension === '.pdf') {
      subFolder = 'documents';
    }

    const fullPath = path.join(this.uploadPath, folder, subFolder, fileName);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { success: true, message: 'تم حذف الملف بنجاح' };
    } else {
      throw new BadRequestException('الملف غير موجود');
    }
  }

  async getFileUrl(fileName: string, folder: string = 'consultations') {
    // تحديد نوع المجلد الفرعي من امتداد الملف
    const extension = path.extname(fileName).toLowerCase();
    let subFolder = 'files';
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      subFolder = 'images';
    } else if (extension === '.pdf') {
      subFolder = 'documents';
    }

    return `/uploads/${folder}/${subFolder}/${fileName}`;
  }

  async getFileInfo(fileName: string, folder: string = 'consultations') {
    const extension = path.extname(fileName).toLowerCase();
    let subFolder = 'files';
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      subFolder = 'images';
    } else if (extension === '.pdf') {
      subFolder = 'documents';
    }

    const fullPath = path.join(this.uploadPath, folder, subFolder, fileName);
    
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      return {
        fileName,
        path: fullPath,
        url: `/uploads/${folder}/${subFolder}/${fileName}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } else {
      throw new BadRequestException('الملف غير موجود');
    }
  }

  async listFiles(folder: string = 'consultations', subFolder?: string) {
    const basePath = path.join(this.uploadPath, folder);
    const targetPath = subFolder ? path.join(basePath, subFolder) : basePath;
    
    if (!fs.existsSync(targetPath)) {
      return [];
    }

    const files = fs.readdirSync(targetPath);
    return files.map(file => ({
      fileName: file,
      url: `/uploads/${folder}/${subFolder || 'files'}/${file}`,
      path: path.join(targetPath, file),
    }));
  }
}