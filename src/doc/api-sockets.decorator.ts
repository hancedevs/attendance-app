import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';

export function ApiWebSocketEvent(event: string, description: string) {
  return applyDecorators(
    ApiOperation({ summary: `WebSocket Event: ${event}`, description }),
    ApiBody({ description: `Payload for ${event} event` })
  );
}