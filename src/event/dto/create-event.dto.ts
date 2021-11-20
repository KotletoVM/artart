import { IsString, IsDate, IsOptional, IsArray, IsNotEmpty, IsUrl, ArrayUnique, ArrayNotEmpty } from "class-validator";
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateEventDto {
    id: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;
    @ApiPropertyOptional()
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    pics: string[];
}
