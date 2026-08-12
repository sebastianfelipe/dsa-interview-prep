import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { CatalogModule } from './catalog/catalog.module';
import { ProblemsModule } from './problems/problems.module';
import { ListsModule } from './lists/lists.module';
import { DocsModule } from './docs/docs.module';

@Module({
  imports: [CatalogModule, ProblemsModule, ListsModule, DocsModule, AiModule],
})
export class AppModule {}
