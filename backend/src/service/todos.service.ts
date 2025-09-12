import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from '../entity';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private idCounter = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  create(text: string): Todo {
    const todo: Todo = {
      id: this.idCounter++,
      text,
      isCompleted: false,
    };
    this.todos.push(todo);
    return todo;
  }

  update(id: number): Todo {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) throw new NotFoundException('Todo not found');
    todo.isCompleted = !todo.isCompleted;
    return todo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) throw new NotFoundException('Todo not found');
    this.todos.splice(index, 1);
  }
}
