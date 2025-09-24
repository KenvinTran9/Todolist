import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Todo } from '../entity/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async create(text: string, userId: number): Promise<Todo> {
    const todo = this.todoRepository.create({
      text,
      isCompleted: false,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.todoRepository.save(todo);
  }


  async update(id: number, userId: number, isCompleted: boolean): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) throw new NotFoundException('Todo not found');
    if (todo.createdBy !== userId) throw new ForbiddenException('Not allowed');

    todo.isCompleted = isCompleted;
    todo.updatedAt = new Date();
    return this.todoRepository.save(todo);
  }


  async remove(id: number, userId: number): Promise<{ message: string }> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) throw new NotFoundException('Todo not found');
    if (todo.createdBy !== userId) throw new ForbiddenException('Not allowed');

    await this.todoRepository.delete(id);
    return { message: 'Deleted successfully' };
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async isOwner(todoId: number, userId: number): Promise<boolean> {
    const todo = await this.todoRepository.findOne({ where: { id: todoId } });
    return todo ? todo.createdBy === userId : false;
  }
}
