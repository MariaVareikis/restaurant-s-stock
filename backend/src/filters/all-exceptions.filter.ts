import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

// Define the exception filter class
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
    private readonly logFilePath = path.resolve(process.cwd(), 'error.log');

    // Method to handle exceptions
    catch(exception: unknown, host: ArgumentsHost) {
        // Get request and response contexts
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Determine the response status
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // Determine the error message
        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception;

        // Create an error response object
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
        };

        // Log the error to the console
        this.logger.error(
            `HTTP Status: ${status} Error Message: ${JSON.stringify(message)}`,
        );

        // Append the error to the log file
        fs.appendFileSync(
            this.logFilePath,
            `${new Date().toISOString()} - ${JSON.stringify(errorResponse)}\n`,
        );

        // Send the error response to the client
        response.status(status).json(errorResponse);
    }
}
