import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { PAGINATION_PARAMS_KEY } from './pagination.decorator'; // Adjust path as necessary
import { Reflector } from '@nestjs/core';

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor<T, T[]> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T[]> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const paginationParams = this.reflector.get<{ fromParam: string; toParam: string }>(PAGINATION_PARAMS_KEY, handler);

    if (!paginationParams) {
      return next.handle();
    }

    const { fromParam, toParam } = paginationParams;
    const from = parseInt(request.query[fromParam], 10) || 0;
    const to = parseInt(request.query[toParam], 10) || 20;

    return next.handle().pipe(
      map(result => {
        if (!Array.isArray(result)) {
          throw new BadRequestException('Result is not an array');
        }
        return result.slice(from, to);
      }),
    );
  }
}
