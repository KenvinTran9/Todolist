import { Module } from '@nestjs/common';
import { TodosController } from '../controller/todos.controller';
import { TodosService } from '../service/todos.service';
import { TodoOwnerGuard } from '../security/guard/todo-owner.guard';
import { Todo } from 'src/entity/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm'
;
@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService, TodoOwnerGuard], 
  exports: [TodosService],
})
export class TodosModule {}
