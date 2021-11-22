import { IsOptional, IsString, IsUrl, IsNotEmpty, IsArray, Min, ArrayNotEmpty, IsEmpty } from "class-validator";
import { Tag } from "src/tag/entities/tag.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePersonDto {
     id: number;
     @ApiPropertyOptional()
     @IsOptional()
     @IsString()
     fullname?: string;
     @ApiPropertyOptional()
     @IsOptional()
     @IsString()
     pseudonym?: string;
     @ApiPropertyOptional()
     @IsOptional()
     @IsString()
     description?: string;
     @ApiPropertyOptional()
     @IsOptional()
     @IsUrl()
     personpic?: string;
     @ApiPropertyOptional()
     @IsOptional()
     @IsUrl()
     previewWork?: string;
     @ApiProperty()
     @IsNotEmpty()
     @IsArray()
     @ArrayNotEmpty()
     tags: Tag[];
     @IsEmpty()
     likes: number;
     @IsEmpty()
     views: number;
     @IsEmpty()
     comments: number;
}
