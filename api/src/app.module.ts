import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { ProblemsModule } from './problems/problems.module';
import { ListsModule } from './lists/lists.module';
import { DocsModule } from './docs/docs.module';

@Module({
  imports: [CatalogModule, ProblemsModule, ListsModule, DocsModule],
})
export class AppModule {}
