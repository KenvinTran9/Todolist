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
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from '../service/todos.service';
import { JwtAuthGuard } from '../security/guard/jwt-auth.guard';
import { TodoOwnerGuard } from '../security/guard/todo-owner.guard';
import { Todo } from '../entity/todo.entity';
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
  async findAll(@Request() req): Promise<Todo[]> {
    const todos = await this.todosService.findAll();
    return todos.map((todo) => ({
      ...todo,
      createdByUsername: `User${todo.createdBy}`, 
    }));
  }

  @Post()
  async create(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todosService.create(createTodoDto.text, req.user.userId);
  }

  @UseGuards(TodoOwnerGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todosService.update(
      id,
      req.user.userId,
      updateTodoDto.isCompleted,
    );
  }

  @UseGuards(TodoOwnerGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<{ message: string }> {
    return this.todosService.remove(id, req.user.userId);
  }

  @UseGuards(TodoOwnerGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
    const todo = await this.todosService.findOne(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }
}
