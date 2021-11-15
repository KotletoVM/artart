import { CreateHashedRefreshTokenDto } from './dto/create-hashed-refresh-token.dto';
import { UpdateHashedRefreshTokenDto } from './dto/update-hashed-refresh-token.dto';
export declare class HashedRefreshTokenService {
    create(createHashedRefreshTokenDto: CreateHashedRefreshTokenDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateHashedRefreshTokenDto: UpdateHashedRefreshTokenDto): string;
    remove(id: number): string;
}
