import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateHashedRefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    userid: number;
    @ApiProperty()
    @IsNotEmpty()
    token: string;
}
