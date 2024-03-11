const { existsSync, statSync, openSync, mkdirSync, closeSync } = require("fs");
const { join } = require("path");
const { HOME, TODO_DIR, PATH_SEPARATOR } = require("./config").path;

function doesTodoDirectoryExist() {
  return existsSync(join(process.env[HOME], TODO_DIR));
}

function doesFileExist(path) {
  return existsSync(join(process.env[HOME], TODO_DIR, path));
}

function createTodoDirectoryIfNotExist() {
  if (!doesTodoDirectoryExist()) {
    return mkdirSync(join(process.env[HOME], TODO_DIR));
  }
}

function createPriorityFileIfNotExist(priority) {
  if (!doesFileExist(priority)) {
    try {
      const id = openSync(join(process.env[HOME], TODO_DIR, priority), "w");
      closeSync(id);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = {
  doesFileExist,
  doesTodoDirectoryExist,
  createTodoDirectoryIfNotExist,
  createPriorityFileIfNotExist,
};
