import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { Todo } from '../entity';
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(): Todo[] {
    return this.todosService.findAll(); // trả về tất cả todos
  }

  @Post('create')
  create(@Body() body: { text: string }, @Request() req): Todo {
    return this.todosService.create(body.text, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Request() req, @Body() body: { isCompleted: boolean }): Todo {
    return this.todosService.update(Number(id), req.user.userId, body.isCompleted);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): { message: string } {
    return this.todosService.remove(Number(id), req.user.userId);
  }
}
