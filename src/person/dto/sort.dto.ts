import { IsOptional, IsNumber, Matches, Contains } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class SortDto {
     @ApiPropertyOptional()
     @IsOptional()
     @Matches(/^\d+$/)
     take: string = '10'
     @ApiPropertyOptional()
     @IsOptional()
     @Matches(/^\d+$/)
     skip: string = '0'
     @ApiPropertyOptional()
     @IsOptional()
     @Matches(/ASC|DESC/, {message: "Order must be ASC or DESC"})
     order: 'DESC'|'ASC' = 'DESC'
     @ApiPropertyOptional()
     @IsOptional()
     @Matches(/alphabet|popular|createDate/, {message: "Order must be ASC or DESC"})
     orderBy: string = 'createDate'
}
