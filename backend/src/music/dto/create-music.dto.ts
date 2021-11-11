import { IsNotEmpty, IsUrl, IsOptional, IsString, IsNumber } from "class-validator";

export class CreateMusicDto {
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
    @IsNumber()
    personid: number;
}
