import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ListsService } from './lists.service';

@ApiTags('lists')
@Controller('lists')
export class ListsController {
  constructor(@Inject(ListsService) private readonly lists: ListsService) {}

  @Get()
  @ApiOperation({ summary: 'List prep lists with coverage counts' })
  listAll() {
    return this.lists.listAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a prep list with per-problem coverage' })
  @ApiParam({ name: 'id', example: 'easy-2z168m6d' })
  getList(@Param('id') id: string) {
    return this.lists.getList(id);
  }
}
