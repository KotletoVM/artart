import { ApiPropertyOptional } from "@nestjs/swagger";

export class SearchPersonDto {
     @ApiPropertyOptional()
     fullname?: string;
     @ApiPropertyOptional()
     pseudonym?: string;
     @ApiPropertyOptional()
     description?: string;
     @ApiPropertyOptional()
     views?: 'DESC' | 'ASC';
}
