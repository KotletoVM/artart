import { IsNotEmpty, IsString, IsOptional, IsUrl, ArrayNotEmpty, ArrayUnique, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateArtDto {
    id: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    url: string[];
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    pic?: string[];
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    video?: string[];
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;
    @ApiProperty()
    @IsNotEmpty()
    personid: number;
}
