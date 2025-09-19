import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { TodoOwnerGuard } from '../TodoOwnerGuard';
import type { Todo } from '../entity';

export class CreateTodoDto {
  text: string;
}

export class UpdateTodoDto {
  isCompleted: boolean;
}

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(@Request() req): Todo[] {
    const todos = this.todosService.findAll();
    return todos.map((todo) => ({
      ...todo,
      createdByUsername: this.todosService.getUsernameById(todo.createdBy),
    }));
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req): Todo {
    return this.todosService.create(createTodoDto.text, req.user.userId);
  }

  @UseGuards(TodoOwnerGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Todo {
    return this.todosService.update(
      id,
      req.user.userId,
      updateTodoDto.isCompleted,
    );
  }

  @UseGuards(TodoOwnerGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): { message: string } {
    return this.todosService.remove(id, req.user.userId);
  }

  @UseGuards(TodoOwnerGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Todo {
    const todo = this.todosService.findOne(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }
}
