# todo

A c program to manage your todos in terminal

## Building

```bash

gcc -Wall -Wpedantic src/*.c -o build/todo && ./build/todo
Home directory: /home/anubhav
Todo directory path: /home/anubhav/.todo
Todo directory path: exists
Todo directory: accessible
Info:
./build/todo <priority> <command> <task>
priority is a filename
Commands:
        list             #   lists files and !done tasks
        list all         #   lists all tasks
        add ""           #   add a new item with timestamp and number
        done <number>    #   mark a task done
        done all         #   mark all tasks done
        undone <number>  #   mark a task not done
        undone all       #   mark all tasks not done
        help             #   print list of commands
        info             #   print information about the system
Error: Priority is not specified. Exiting.


```

