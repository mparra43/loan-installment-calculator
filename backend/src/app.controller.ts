import { Controller, Get } from '@nestjs/common';
import{  ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  healthCheck(): { status: string } {
    return { status: 'ok' };
  }
}
