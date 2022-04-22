import { IsString, IsDate, IsOptional, IsArray, IsNotEmpty, IsUrl, ArrayUnique, ArrayNotEmpty, Validate, IsEmpty } from "class-validator";
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger";
import { IsUrlArray } from "src/art/dto/create-art.dto";

export class CreateEventDto {
    @ApiResponseProperty()
    id: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
    @ApiProperty({type: 'string', format: 'date'})
    @IsNotEmpty()
    startDate: Date;
    @ApiPropertyOptional({type: 'string', format: 'date'})
    @IsOptional()
    endDate: Date;
    @ApiProperty()
    place: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @Validate(IsUrlArray, {message: 'Массив картинок должен содержать только ссылки\n'})
    pics: string[];
    @ApiResponseProperty()
    @IsEmpty()
    createdAt: Date;
    @ApiResponseProperty()
    @IsEmpty()
    updatedAt: Date;
}
