import { IsNotEmpty, IsString, IsOptional, IsUrl } from "class-validator";

export class CreateArtDto {
    id: number;
    @IsNotEmpty()
    @IsUrl()
    url: string;
    @IsOptional()
    @IsString()
    description?: string;
    @IsOptional()
    @IsString()
    title?: string;
    @IsNotEmpty()
    personid: number;
}