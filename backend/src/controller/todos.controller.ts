import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { Todo } from '../entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  @Get()
  findAll(): Todo[] {
    return this.todosService.findAll();
  }

  @Post('create')
  create(@Body() body: { text: string }): { todo: Todo } {
    const todo = this.todosService.create(body.text);
    return { todo };
  }

  @Put(':id')
  update(@Param('id') id: string): Todo {
    return this.todosService.update(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.todosService.remove(Number(id));
  }
}
