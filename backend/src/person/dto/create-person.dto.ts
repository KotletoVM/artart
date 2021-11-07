import { IsOptional, IsString } from "class-validator";

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
}
