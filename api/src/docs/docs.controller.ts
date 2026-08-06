import { Controller, Get, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(@Inject(DocsService) private readonly docs: DocsService) {}

  @Get()
  index() {
    return this.docs.index();
  }

  @Get('*path')
  getDoc(@Req() req: Request) {
    const prefix = '/api/docs/';
    const url = req.url.startsWith(prefix) ? req.url.slice(prefix.length) : req.url.replace(/^\/+/, '');
    const pathOnly = decodeURIComponent(url.split('?')[0] ?? '');
    return this.docs.getDoc(pathOnly);
  }
}
