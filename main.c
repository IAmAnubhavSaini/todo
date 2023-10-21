#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <unistd.h>
#include <sys/stat.h>
#include <time.h>
#include <asm-generic/errno-base.h>
#include <asm-generic/errno.h>
#include <fcntl.h>
#include <errno.h>
#include <string.h>

#define PATH_SEPARATOR "/"
#define HOME "HOME"
#define TODO_DIR ".todo"
#define TIME_STRING_LEN 100
#define MAX_LINES_COUNT 100
#define MAX_LINE_LENGTH 1023
#define MAX_TODO_FILE_RW_BYTES MAX_LINE_LENGTH*MAX_LINES_COUNT

/**
 * Commands can be:
 * list             #   lists files and !done tasks
 * list all         #   lists all tasks
 * add ""           #   add a new item with timestamp and number
 * done <number>    #   mark a task done
 * done all         #   mark all tasks done
 * undone <number>  #   mark a task not done
 * undone all       #   mark all tasks not done
 */
#define COMMAND_LIST "list"
#define COMMAND_ADD "add"
#define COMMAND_DONE "done"
#define COMMAND_UNDONE "undone"

typedef struct TodoFile {
    int fd;
    off_t len;
    char *name;
} TodoFile;

TodoFile *newTodoFile(int fd, off_t len, char *name) {
    TodoFile *ntf = (TodoFile *) calloc(1, sizeof(TodoFile));
    if (ntf == NULL) {
        fprintf(stderr, "Cannot allocate memory for TodoFile.\n");
        exit(1);
    }
    ntf->fd = fd;
    ntf->len = len;
    ntf->name = name;
    return ntf;
}

void closeTodoFile(TodoFile *tf) {
    int result = close(tf->fd);
    if (result == -1) {
        switch (result) {
            case EBADF: {
                printf("fd isn't a valid open file descriptor.\n");
                break;
            }
            case EINTR: {
                printf("The close() call was interrupted by a signal; see signal(7).\n");
                break;
            }
            case EIO: {
                printf("An I/O error occurred.\n");
                break;
            }
            default: {
                printf("Check if fs is NFS or some other error happened.\n");
            }
        }
    }
    tf->len = 0;
//    free(tf->name); // double free or corruption error; Aborted, core dumped
    free(tf);
}

void printTodoFile(TodoFile *tf) {
    printf("\n=====================================================================\n");
    printf("File:\npath: %s descriptor:%d length:%ld\n", tf->name, tf->fd, tf->len);
    printf("=====================================================================\n");
}

bool pathExists(char *path) {
    return access(path, F_OK) != -1;
}

bool dirAccessible(char *path) {
    return access(path, W_OK | R_OK) != -1;
}

char *getCurrentLocalTime() {
    time_t currentTime = time(NULL);
    struct tm *localTime = localtime(&currentTime);
    char *timeString = (char *) calloc(1, TIME_STRING_LEN * sizeof(char));
    if (timeString == NULL) {
        fprintf(stderr, "Error: Cannot allocate memory for timeString.\n");
        exit(1);
    }
    strftime(timeString, TIME_STRING_LEN, "%Y.%m.%d-%H.%M.%S", localTime);
    return timeString;
}

int main(int argc, char *argv[]) {
    const char *homeDir = getenv(HOME);
    printf("%s\n", homeDir);
    if (homeDir == NULL) {
        fprintf(stderr, "Error: Unable to determine home directory.\n");
        return 0;
    }

    char todoDirPath[256];

    snprintf(todoDirPath, sizeof(todoDirPath), "%s%s%s", homeDir, PATH_SEPARATOR, TODO_DIR);

    printf("%s\n", todoDirPath);

    printf("%s\n", pathExists(todoDirPath) ? "exists" : "does not exist");
    printf("%s\n", dirAccessible(todoDirPath) ? "accessible" : "not accessible");

    if (!pathExists(todoDirPath)) {
        /*
         * #define    S_IRWXU    (__S_IREAD|__S_IWRITE|__S_IEXEC)
         *                       (400      | 200      | 100     )
         * */
        int out = mkdir(todoDirPath, S_IRWXU);
        /**
         * mkdir returns 0 if successful, otherwise:
         * EACCES
         * EDQUOT
         * EEXIST
         * EFAULT
         * EINVAL
         * ELOOP
         * EMLINK
         * ENAMETOOLONG
         * ENOENT
         * ENOMEM
         * ENOSPC
         * ENOTDIR
         * EPERM
         * EROFS
         */
        if (out != 0) {
            fprintf(stderr, "Cannot create directory :%s\n", todoDirPath);
            int errorCode = errno;
            switch (errorCode) {
                case EACCES: {
                    printf("The  parent  directory  does  not  allow write permission to the\n"
                           "process, or one of the directories in  pathname  did  not  allow\n"
                           "search permission.");
                    break;
                }
                case EDQUOT: {
                    printf("%d\n", EDQUOT);
                    break;
                }
                case EEXIST: {
                    printf("pathname  already exists (not necessarily as a directory).\n"
                           "This includes the case where pathname is a symbolic link, dangling or not.");
                    break;
                }
                case EFAULT: {
                    printf("%d\n", EFAULT);
                    break;
                }
                case EINVAL: {
                    printf("%d\n", EINVAL);
                    break;
                }
                case ELOOP: {
                    printf("%d\n", ELOOP);
                    break;
                }
                case EMLINK: {
                    printf("%d\n", EMLINK);
                    break;
                }
                case ENAMETOOLONG: {
                    printf("%d\n", ENAMETOOLONG);
                    break;
                }
                case ENOENT: {
                    printf("%d\n", ENOENT);
                    break;
                }
                case ENOMEM: {
                    printf("%d\n", ENOMEM);
                    break;
                }
                case ENOSPC: {
                    printf("%d\n", ENOSPC);
                    break;
                }
                case ENOTDIR: {
                    printf("%d\n", ENOTDIR);
                    break;
                }
                case EPERM: {
                    printf("%d\n", EPERM);
                    break;
                }
                case EROFS: {
                    printf("%d\n", EROFS);
                    break;
                }
                default:
                    printf("Cannot mkdir, errorCode:%d\n", errorCode);
                    break;
            }
            exit(1);
        }
    }

    if (!dirAccessible(todoDirPath)) {
        fprintf(stderr, "Directory is not accessible :%s\n", todoDirPath);
        exit(1);
    }

    char *priority = argv[1];
    char finalFilePath[256];
    snprintf(finalFilePath, sizeof(finalFilePath), "%s%s%s", todoDirPath, PATH_SEPARATOR, priority);
    printf("Final File Path: %s\n", finalFilePath);
    int fd = open(finalFilePath, O_RDWR | O_CREAT, S_IWUSR | S_IRUSR);
    if (fd == -1) {
        printf("File System Error: Cannot open file: %s\n", priority);
        int errorCode = errno;
        switch (errorCode) {
            case EACCES: {
                printf("Error: Permission denied\n");
                break;
            }
            case EEXIST: {
                printf("Error: File already exists\n");
                break;
            }
            case EINVAL: {
                printf("Error: Invalid argument\n");
                break;
            }
            case EMFILE: {
                printf("Error: Too many open files\n");
                break;
            }
            case ENAMETOOLONG: {
                printf("Error: File name too long\n");
                break;
            }
            case ENFILE: {
                printf("Error: Too many open files in the system\n");
                break;
            }
            case ENOENT: {
                printf("Error: File or directory not found\n");
                break;
            }
            case ENOSPC: {
                printf("Error: No space left on device\n");
                break;
            }
            case ENOTDIR: {
                printf("Error: Not a directory\n");
                break;
            }
            case ELOOP: {
                printf("Error: Too many symbolic links encountered\n");
                break;
            }
            case EROFS: {
                printf("Error: Read-only file system\n");
                break;
            }
            case EIO: {
                printf("Error: I/O error\n");
                break;
            }
            case ENOMEM: {
                printf("Error: Out of memory\n");
                break;
            }
            default: {
                printf("Error: Unknown error code %d\n", errorCode);
                break;
            }
        }

        exit(EXIT_FAILURE);
    }

    // Seek to get the file size
    off_t fileLength = lseek(fd, 0, SEEK_END);
    TodoFile *tf = newTodoFile(fd, fileLength, finalFilePath);
    printTodoFile(tf);

    // Seek to 0 to read the file.
    off_t seekResult = lseek(tf->fd, 0, SEEK_SET);
    if(seekResult == -1) {
        int errorCode = errno;
        switch(errorCode) {
            case EINVAL:
                printf("Error: Invalid argument\n");
                break;
            case ESPIPE:
                printf("Error: The file descriptor refers to a pipe, socket, or FIFO, or it does not support seeking\n");
                break;
            case EBADF:
                printf("Error: Bad file descriptor\n");
                break;
            case EOVERFLOW:
                printf("Error: Resulting file offset cannot be represented in an off_t data type\n");
                break;
            case ESRCH:
                printf("Error: File descriptor does not exist\n");
                break;
            default:
                fprintf(stderr, "Error seeking to the beginning of the file: %d\n", errorCode);
        }
    }

    char buffer[MAX_LINE_LENGTH + 1];
    char *lines[MAX_LINES_COUNT];
    int lineCount = 0;
    ssize_t bytesRead = read(tf->fd, buffer, MAX_LINE_LENGTH);
    while(bytesRead > 0 ){
        buffer[bytesRead] = '\0';
        char *tokens = strtok(buffer, "\n");
        char * tmp = tokens;
        while(tmp != NULL && lineCount < MAX_LINES_COUNT) {
            lines[lineCount] = strdup(tmp);
            lineCount++;
            tmp = strtok(NULL, "\n");
        }
        bytesRead = read(tf->fd, buffer, MAX_LINE_LENGTH);
    }

    for(int i = 0; i < lineCount; i++) {
        printf("%s\n", lines[i]);
    }



    closeTodoFile(tf);
    return 0;
}
