import { ApiResponseProperty } from "@nestjs/swagger"

export class ClientErrorResponseSchema {
    @ApiResponseProperty()
    statusCode: number
    @ApiResponseProperty()
    message: string
    @ApiResponseProperty()
    error: string
}