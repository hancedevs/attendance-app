import { SetMetadata } from '@nestjs/common';

export const PAGINATION_PARAMS_KEY = 'paginationParams';

export const PaginatedRoute = (fromParam: string = 'from', toParam: string = 'to') => 
  SetMetadata(PAGINATION_PARAMS_KEY, { fromParam, toParam });
