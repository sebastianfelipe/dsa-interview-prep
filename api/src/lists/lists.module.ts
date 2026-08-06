import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [CatalogModule],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
