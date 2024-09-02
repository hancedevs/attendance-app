import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : exception;

    // Log the error details
    this.logger.error(`HTTP Status: ${status}, Error Message: ${JSON.stringify(message)}`);

    let err: any = message;

    if((message as any).name === 'PrismaClientValidationError'){
      err = {
        statusCode: status,
        error: "Database Error",
        message: `Unable to validate client. This might have happened incase: - Data changed in the database and unable to resolve in client\n- Database Access Error`
      }
    }

    if((message as any).name === "PrismaClientKnownRequestError"){
      err = {
        statusCode: status,
        error: "Database Error",
        message: `Database Error: ${err.code}: (${err.meta.modelName}) ${err.meta.cause}`
      }
    }

    response
      .status(status)
      .json(err);
  }
}
