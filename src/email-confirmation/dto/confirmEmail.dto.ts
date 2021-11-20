import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
}

export default ConfirmEmailDto;