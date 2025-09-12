import { Module } from '@nestjs/common';
import { TodosModule } from './module/todos.module';

@Module({
  imports: [TodosModule],  
})
export class AppModule {}
