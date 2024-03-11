const { path, lengths, errors } = require("./config");

describe("config", () => {
  describe("errors", () => {
    const {
      EC_HOME_DIR_NOT_FOUND,
      EC_CANNOT_SEEK_FILE,
      EC_CANNOT_SEEK_FILE_BACKWARDS,
    } = errors;
    it("should have the correct config", () => {
      expect(EC_HOME_DIR_NOT_FOUND).toBe(1001);
      expect(EC_CANNOT_SEEK_FILE).toBe(1002);
      expect(EC_CANNOT_SEEK_FILE_BACKWARDS).toBe(1003);
    });
  });
  describe("lengths", () => {
    const {
      TIME_STRING_LEN,
      MAX_LINES_COUNT,
      MAX_LINE_LENGTH,
      MAX_TODO_FILE_RW_BYTES,
      S_MAX_FINAL_PATH_LENGTH,
      S_MAX_TODO_DIR_PATH_LENGTH,
      S_MAX_PRIORITY_FILE_NAME,
    } = lengths;
    
    it("should have the correct config", () => {
      expect(TIME_STRING_LEN).toBe(100);
      expect(MAX_LINES_COUNT).toBe(100);
      expect(MAX_LINE_LENGTH).toBe(1023);
      expect(MAX_TODO_FILE_RW_BYTES).toBe(102300);
      expect(S_MAX_FINAL_PATH_LENGTH).toBe(512);
      expect(S_MAX_TODO_DIR_PATH_LENGTH).toBe(256);
      expect(S_MAX_PRIORITY_FILE_NAME).toBe(32);
    });
  });

  describe("path", () => {
    const { PATH_SEPARATOR, HOME, TODO_DIR } = path;
    it("should have the correct config", () => {
      expect(PATH_SEPARATOR).toBe("/");
      expect(HOME).toBe("HOME");
      expect(TODO_DIR).toBe(".todo");
    });
  });
});
