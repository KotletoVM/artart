import { HashedRefreshTokenService } from './hashed-refresh-token.service';
import { CreateHashedRefreshTokenDto } from './dto/create-hashed-refresh-token.dto';
import { UpdateHashedRefreshTokenDto } from './dto/update-hashed-refresh-token.dto';
export declare class HashedRefreshTokenController {
    private readonly hashedRefreshTokenService;
    constructor(hashedRefreshTokenService: HashedRefreshTokenService);
    create(createHashedRefreshTokenDto: CreateHashedRefreshTokenDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateHashedRefreshTokenDto: UpdateHashedRefreshTokenDto): string;
    remove(id: string): string;
}
