import { Module } from '@nestjs/common';
import { TodosModule } from './module/todos.module';
import { AuthModule } from './module/auth.module'; 

@Module({
  imports: [TodosModule, AuthModule],
})
export class AppModule {}
