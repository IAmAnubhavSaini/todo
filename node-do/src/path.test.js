const { doesFileExist, doesTodoDirectoryExist } = require("./path");
const { HOME, TODO_DIR } = require("./config").path;
const { openSync, closeSync, unlinkSync } = require("fs");
const { join } = require("path");

describe("path", () => {
    describe("doesTodoDirectoryExist", () => {
        it(`should return true if the ${TODO_DIR} directory exists`, () => {
            expect(doesTodoDirectoryExist()).toBe(true);
        });
    });

    describe("doesFileExist", () => {
        it("should return true if the file exists", () => {
            expect(doesFileExist("test")).toBe(false);
            const id = openSync(join(process.env[HOME], TODO_DIR, "test"), "w");
            closeSync(id);
            expect(doesFileExist("test")).toBe(true);
            unlinkSync(`${process.env.HOME}/${TODO_DIR}/test`);
            expect(doesFileExist("test")).toBe(false);
        });
    });
});
