import { Module } from '@nestjs/common';
import { TodosController } from '../controller/todos.controller';
import { TodosService } from '../service/todos.service';
import { TodoOwnerGuard } from '../TodoOwnerGuard';
@Module({
  controllers: [TodosController],
  providers: [TodosService, TodoOwnerGuard], // 👈 thêm guard vào đây
  exports: [TodosService],
})
export class TodosModule {}
