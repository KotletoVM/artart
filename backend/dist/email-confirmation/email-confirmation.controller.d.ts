import { EmailConfirmationService } from './email-confirmation.service';
export declare class EmailConfirmationController {
    private readonly emailConfirmationService;
    constructor(emailConfirmationService: EmailConfirmationService);
    confirm(confirmEmailDto: string): Promise<void>;
    resendConfirmationLink(req: any): Promise<void>;
}
