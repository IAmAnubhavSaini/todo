# todo in nodejs

A terminal app that can manage your todo list

```bash
mkdir -p ~/.todo

npm run start list daily # creates a file ~/.todo/daily


debian :: src/todo ‹main*› » cd node-do
debian :: src/todo/node-do ‹main*› » npm run start list daily

> @f0c1s/node-do@0.0.0-b1 start
> node src/todo.js list daily

1744476138882 args [INFO] list,daily
debian :: src/todo/node-do ‹main*› » npm run start add daily "have dinner. Food is always a good idea."

> @f0c1s/node-do@0.0.0-b1 start
> node src/todo.js add daily have dinner. Food is always a good idea.

1744476145259 args [INFO] add,daily,have dinner. Food is always a good idea.
debian :: src/todo/node-do ‹main*› » npm run start list daily

> @f0c1s/node-do@0.0.0-b1 start
> node src/todo.js list daily

1744476147471 args [INFO] list,daily
1: have dinner. Food is always a good idea.
debian :: src/todo/node-do ‹main*› » npm run start done daily 1

> @f0c1s/node-do@0.0.0-b1 start
> node src/todo.js done daily 1

1744476155948 args [INFO] done,daily,1
{
  data: [ 'have dinner. Food is always a good idea.', '' ],
  todos: [ '' ]
}
debian :: src/todo/node-do ‹main*› » npm run start list daily

> @f0c1s/node-do@0.0.0-b1 start
> node src/todo.js list daily

1744476158911 args [INFO] list,daily
```
