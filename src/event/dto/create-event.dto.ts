import { IsString, IsDate, IsOptional, IsArray, IsNotEmpty, IsUrl, ArrayUnique, ArrayNotEmpty } from "class-validator";
import { Type } from 'class-transformer';

export class CreateEventDto {
    id: number;
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsString()
    description: string;
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    pics: string[];
}
