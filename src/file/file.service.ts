import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {S3, Endpoint} from 'aws-sdk';

@Injectable()
export class FileService {
    constructor(private configService: ConfigService) {
    }
    async saveFile(key: string, file:  Express.Multer.File){
        const s3 = new S3({
            endpoint: new Endpoint(this.configService.get('awsConfig.endpoint')),
            httpOptions: {timeout: 10000, connectTimeout: 10000}
        });
        const uploadResult = await s3.upload({
            Bucket: this.configService.get('awsConfig.bucket'),
            Body: file.buffer,
            Key: key
        }).promise();
        return uploadResult;
    }
}
