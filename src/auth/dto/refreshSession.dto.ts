import { IsNotEmpty, IsString, IsOptional, IsUrl, ArrayNotEmpty, ArrayUnique, IsArray, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate, IsEmpty } from "class-validator";
import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger";

export class RefreshSessionDto {
    userid?: number;
    ua: string;
    fingerprint?: string;
    @IsEmpty()
    ip: string;
}