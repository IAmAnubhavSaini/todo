/* path reated constants */
const PATH_SEPARATOR = "/";
const HOME = "HOME";
const TODO_DIR = ".todo";

/* length related constants */
const TIME_STRING_LEN = 100;
const MAX_LINES_COUNT = 100;
const MAX_LINE_LENGTH = 1023;
const MAX_TODO_FILE_RW_BYTES = MAX_LINE_LENGTH * MAX_LINES_COUNT;
const S_MAX_FINAL_PATH_LENGTH = 512;
const S_MAX_TODO_DIR_PATH_LENGTH = 256;
const S_MAX_PRIORITY_FILE_NAME = 32;

/* error codes */
const EC_HOME_DIR_NOT_FOUND = 1001;
const EC_CANNOT_SEEK_FILE = 1002;
const EC_CANNOT_SEEK_FILE_BACKWARDS = 1003;

module.exports = {
  path: {
    PATH_SEPARATOR,
    HOME,
    TODO_DIR,
  },
  lengths: {
    TIME_STRING_LEN,
    MAX_LINES_COUNT,
    MAX_LINE_LENGTH,
    MAX_TODO_FILE_RW_BYTES,
    S_MAX_FINAL_PATH_LENGTH,
    S_MAX_TODO_DIR_PATH_LENGTH,
    S_MAX_PRIORITY_FILE_NAME,
  },
  errors: {
    EC_HOME_DIR_NOT_FOUND,
    EC_CANNOT_SEEK_FILE,
    EC_CANNOT_SEEK_FILE_BACKWARDS,
  },
};
