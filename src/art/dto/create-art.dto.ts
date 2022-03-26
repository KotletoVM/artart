import { IsNotEmpty, IsString, IsOptional, IsUrl, ArrayNotEmpty, ArrayUnique, IsArray, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from "class-validator";
import { ApiProperty, ApiPropertyOptional, ApiResponseProperty } from "@nestjs/swagger";

@ValidatorConstraint()
export class IsUrlArray implements ValidatorConstraintInterface {
    public async validate(array: string[], args: ValidationArguments) {
        let result = true;
        array.forEach(element => {
            if (!/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
                .test(element)) result = false
        })
        return result
    }
}

export class CreateArtDto {
    @ApiResponseProperty()
    id: number;
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @Validate(IsUrlArray, {message: 'Массив картинок должен содержать только ссылки\n'})
    pic?: string[];
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @Validate(IsUrlArray, {message: 'Массив видео должен содержать только ссылки\n'})
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
    @ApiPropertyOptional()
    previewChange: boolean;
}
