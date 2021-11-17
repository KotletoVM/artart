import { PartialType } from '@nestjs/mapped-types';
import { CreateHashedRefreshTokenDto } from './create-hashed-refresh-token.dto';

export class UpdateHashedRefreshTokenDto extends PartialType(CreateHashedRefreshTokenDto) {}
