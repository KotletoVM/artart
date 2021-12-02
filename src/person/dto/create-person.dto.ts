import { IsOptional, IsString, IsUrl, IsNotEmpty, IsArray, Min, ArrayNotEmpty, IsEmpty, IsObject } from "class-validator";
import { Tag } from "src/tag/entities/tag.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePersonDto {
     id: number;
     @ApiProperty()
     @IsString({ message: 'Полное имя артиста должно быть строкой\n' })
     @IsNotEmpty({ message: 'Необходимо указать полное имя артиста\n' })
     fullname: string;
     @ApiPropertyOptional()
     @IsOptional()
     @IsString({ message: 'Псевдоним артиста должен быть строкой\n' })
     pseudonym?: string;
     @ApiPropertyOptional()
     @IsOptional()
     @IsString({ message: 'Описание артиста должно быть строкой\n' })
     description?: string;
     @ApiPropertyOptional()
     @IsOptional()
     @IsUrl({}, { message: 'Для загрузки картинки укажите ссылку\n' })
     personpic?: string;
     @ApiPropertyOptional()
     @IsOptional()
     @IsUrl({}, { message: 'Для загрузки картинки укажите ссылку\n' })
     previewWork?: string;
     @ApiProperty()
     @IsNotEmpty({ message: 'Необходимо указать теги артиста\n' })
     @IsArray({ message: 'Теги необходимо указать массивом\n' })
     @ArrayNotEmpty({ message: 'Необходимо указать теги артиста\n' })
     tags: Tag[];
     @IsEmpty()
     likes: number;
     @IsEmpty()
     views: number;
     @IsEmpty()
     comments: number;
     @IsOptional()
     @IsObject({ message: 'Соцсети должны быть указаны как Object\n' })
     socNetworks: {
          instagram: string;
          vk: string;
          tg: string;
          spotify: string;
          site: string;
     };
}
