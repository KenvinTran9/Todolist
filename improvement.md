### 1. Restructure folders
While this project is currently for basic learning with limited domains, we should establish a cleaner folder structure that makes files easier to locate. As requirements become more complex, the current structure will become difficult to maintain. We should organize related files into dedicated folders such as controllers, modules, services, guards, and entities.

### 2. Improve file naming consistency
We should establish consistent naming conventions for files with similar functionality. For example, our guard files `jwt-auth.guard.ts` and `TodoOwnerGuard.ts` serve similar purposes but follow different naming patterns. This inconsistency makes the codebase harder to navigate and understand.

### 3. Use enums 
In `auth.server.ts`, we have hardcoded role strings:

```js
async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
      role: user.username === 'admin' ? 'admin' : 'user', // hardcoded
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.username === 'admin' ? 'admin' : 'user', // hardcoded
      },
    };
}
```
This approach of manually checking roles using string literals like `'admin'` and `'user'` creates several issues:
- Risk of typos leading to runtime errors
- Difficulty remembering all available roles as the application grows
- Need to update multiple locations when role names change
- No compile-time validation of role names

Using an enum would provide type safety and centralize role definitions.

### 4. Avoid hardcoding configuration values
Several values are currently hardcoded that should be configurable:
```js
// in main.ts
await app.listen(4000); // we can extract the port

// jwt-strategy.ts
constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secret-key', // we should extract the key to env
    });
}
```

These values should be moved to environment variables for better security and flexibility. This allows for:
- Easy configuration changes without code modifications
- Secure handling of sensitive information like JWT secrets
- Different configurations for different environments (development, staging, production)

### 5. Remove unused code and maintain code quality
In `todos.service.ts`, we have unused functions that should be cleaned up:

```js
// This function appears to be unused - should we remove it?
isOwner(todoId: number, userId: number): boolean {
    const todo = this.findOne(todoId);
    return todo ? todo.createdBy === userId : false;
}
```

Regular code reviews help identify:
- Unused or dead code that can be removed
- Functions that may have been replaced by better implementations
- Code that doesn't follow current patterns or standards

Keeping the codebase clean improves maintainability and reduces confusion for future developers.
