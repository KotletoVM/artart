import { IsNotEmpty } from "class-validator";

export class CreateHashedRefreshTokenDto {
    @IsNotEmpty()
    userid: number;
    @IsNotEmpty()
    token: string;
}
