import { IsNotEmpty, IsString, IsOptional, IsUrl, ArrayNotEmpty, ArrayUnique, IsArray } from "class-validator";

export class CreateArtDto {
    id: number;
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    url: string[];
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsString()
    title?: string;
    @IsNotEmpty()
    personid: number;
}
