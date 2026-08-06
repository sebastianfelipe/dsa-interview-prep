import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsController {
  constructor(@Inject(ListsService) private readonly lists: ListsService) {}

  @Get()
  listAll() {
    return this.lists.listAll();
  }

  @Get(':id')
  getList(@Param('id') id: string) {
    return this.lists.getList(id);
  }
}
