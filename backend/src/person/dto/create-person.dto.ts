import { IsOptional, IsString, IsUrl, IsNotEmpty, IsArray, Min, ArrayNotEmpty } from "class-validator";
import { Tag } from "src/tag/entities/tag.entity";

export class CreatePersonDto {
     id: number;
     @IsOptional()
     @IsString()
     fullname: string;
     @IsOptional()
     @IsString()
     pseudonym: string;
     @IsOptional()
     @IsString()
     description: string;
     @IsOptional()
     @IsUrl()
     personpic: string;
     @IsNotEmpty()
     @IsArray()
     @ArrayNotEmpty()
     tags: Tag[]
}
