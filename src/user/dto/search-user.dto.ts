import { ApiPropertyOptional } from "@nestjs/swagger";

export class SearchUserDto {
    @ApiPropertyOptional()
    name?: string;
}