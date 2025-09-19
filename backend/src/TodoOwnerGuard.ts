import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from './service/todos.service';

@Injectable()
export class TodoOwnerGuard implements CanActivate {
  constructor(private readonly todosService: TodosService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const todoId = parseInt(request.params.id, 10);

    const todo = this.todosService.findOne(todoId);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.createdBy !== user.id) {
      throw new ForbiddenException('You are not allowed to access this todo');
    }
    return true;
  }
}
