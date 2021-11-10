import { IsOptional, IsString, IsUrl } from "class-validator";

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
}
