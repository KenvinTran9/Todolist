import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Todo } from '../entity';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private idCounter = 1;

  findAll(): Todo[] {
    return this.todos; // trả về tất cả
  }

  create(text: string, userId: number): Todo {
    const todo: Todo = { id: this.idCounter++, text, isCompleted: false, createdBy: userId };
    this.todos.push(todo);
    return todo;
  }

  update(id: number, userId: number, isCompleted: boolean): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) throw new NotFoundException('Todo not found');
    if (todo.createdBy !== userId) throw new ForbiddenException('Not allowed');
    todo.isCompleted = isCompleted;
    return todo;
  }

  remove(id: number, userId: number): { message: string } {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Todo not found');
    if (this.todos[index].createdBy !== userId) throw new ForbiddenException('Not allowed');
    this.todos.splice(index, 1);
    return { message: 'Deleted successfully' };
  }

  findOne(id: number): Todo | undefined {
    return this.todos.find((t) => t.id === id);
  }
}
