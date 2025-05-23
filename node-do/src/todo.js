const { info, help } = require("./help");
const { PATH_SEPARATOR, HOME, TODO_DIR } = require("./config").path;
const { log } = require("@f0c1s/node-common-log-lib");

const {
    doesFileExist,
    doesTodoDirectoryExist,
    createTodoDirectoryIfNotExist,
    createPriorityFileIfNotExist,
} = require("./path");
const { readFileSync, closeSync, readdirSync, appendFileSync, openSync, writeFileSync } = require("fs");
const { join } = require("path");

function run() {
    const { argv } = process;
    const args = argv.slice(2);
    // console.log({ argv, args });

    /** this right here is the time wasting source:
     * spent 2 hours figuring out why a simple logic wasn't working.
     * At what point does the global value makes sense?
     * Node converts the value to string, so the condition !!process.env.debug will always be true
     * */
    const debug = args[0] === "--debug";
    if (debug) {
        process.env.debug = true;
    }

    if (!!process.env.debug) {
        args.shift();
        console.log({ argv, args });
    }
    const argc = args.length;
    if (argc < 1) {
        info();
        return;
    }

    if (args[0] === "help" || args[0] === "--help" || args[0] === "-h") {
        help();
        return;
    } else if (args[0] === "info" || args[0] === "--info" || args[0] === "-i") {
        info();
        return;
    }
    createTodoDirectoryIfNotExist();
    const command = args[0];
    const filename = args[1];
    if (!!process.env.debug) {
        console.log({ args, filename, command });
    }
    createPriorityFileIfNotExist(filename);

    log("args", args.toString());
    switch (command) {
        case "list": {
            const subCommand = args[1] ?? "all";
            if (subCommand === "all") {
                listAll();
            } else {
                // log("list", filename);
                list(filename);
            }
            break;
        }
        case "add": {
            add(filename, args.slice(2).join(" "));
            break;
        }
        case "done": {
            if (args.length < 3) {
                throw new Error("ERROR: need COMMAND FILENAME NUMBER");
            }
            done(filename, args[2]);
            break;
        }
        default: {
            console.log("Unknown command");
            help();
            break;
        }
    }
}

run();

function list(filename) {
    if (!doesTodoDirectoryExist() || !doesFileExist(filename)) {
        return;
    }
    const filepath = join(process.env[HOME], TODO_DIR, filename);
    if (!!process.env.debug) {
        console.log({ filepath });
    }
    /** Do not need to explicitly open or close file. WTF? */
    const file = readFileSync(filepath, "utf8");
    const lines = file.split("\n");
    lines.forEach((line, index) => {
        if (line.length > 0) {
            console.log(`${index + 1}: ${line}`);
        }
    });
}

function listAll() {
    if (!doesTodoDirectoryExist()) {
        return;
    }
    const files = readdirSync(join(process.env[HOME], TODO_DIR));
    if (!!process.env.debug) {
        console.log({ files });
    }
    files.forEach((file) => {
        console.log(`\n${file}:`);
        list(file);
    });
}

function add(filename, task) {
    if (!doesTodoDirectoryExist() || !doesFileExist(filename)) {
        return;
    }
    const filepath = join(process.env[HOME], TODO_DIR, filename);
    if (!!process.env.debug) {
        console.log({ filepath });
    }
    const file = openSync(filepath, "a");
    appendFileSync(file, `${task}\n`);
    closeSync(file);
}

function done(filename, taskId) {
    if (taskId < 1) {
        log("done", `Task with id ${taskId} not available for deletion.`);
        return;
    }
    if (!doesTodoDirectoryExist() || !doesFileExist(filename)) {
        return;
    }
    const filepath = join(process.env[HOME], TODO_DIR, filename);
    const doneFilePath = join(process.env[HOME], TODO_DIR, filename + ".done");
    if (!!process.env.debug) {
        console.log({ filepath, doneFilePath });
    }
    const data = readFileSync(filepath, { encoding: "utf8" }).split("\n");
    if (taskId > data.length) {
        log("done", `Task with id ${taskId} not available for deletion.`);
        return;
    }
    const todos = data.filter((_, i) => i !== taskId - 1);
    console.log({ data, todos });

    writeFileSync(filepath, "");
    writeFileSync(filepath, todos.join("\n"));
}
