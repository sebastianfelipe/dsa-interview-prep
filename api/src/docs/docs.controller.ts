import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { DocsService } from './docs.service';

@ApiTags('docs')
@Controller('docs')
export class DocsController {
  constructor(@Inject(DocsService) private readonly docs: DocsService) {}

  @Get()
  @ApiOperation({ summary: 'Index of reference markdown documents' })
  index() {
    return this.docs.index();
  }

  @Get('*path')
  @ApiOperation({ summary: 'Fetch a reference markdown document by path' })
  getDoc(@Req() req: Request) {
    const prefix = '/api/docs/';
    const url = req.url.startsWith(prefix) ? req.url.slice(prefix.length) : req.url.replace(/^\/+/, '');
    const pathOnly = decodeURIComponent(url.split('?')[0] ?? '');
    return this.docs.getDoc(pathOnly);
  }
}
