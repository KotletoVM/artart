import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
declare const EmailConfirmationStrategy_base: new (...args: any[]) => Strategy;
export declare class EmailConfirmationStrategy extends EmailConfirmationStrategy_base {
    private readonly userService;
    private configService;
    constructor(userService: UserService, configService: ConfigService);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<import("../../user/entities/user.entity").User>;
}
export {};
