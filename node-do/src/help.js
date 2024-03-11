function info() {
    console.log("Info:");
    console.log("This is a simple todo list program.");
    console.log("It uses a file to store the tasks.");
    console.log("The file is stored in the HOME directory.");
    console.log("The file has one task per line.");
    console.log("Done tasks are moved to .done file.");
    console.log("%s <command> <file> <task|subcommand>", process.argv[0]);
    help();
}

function help() {
    console.log("Commands:");
    console.log("\tlist     <file>              #   lists files and tasks");
    console.log("\tadd      <file>  text        #   add a new item with timestamp and number");
    console.log("\tdone     <file>  <number>    #   mark a task done");
    console.log("\tdone     <file>  all         #   mark all tasks done");
    console.log("\thelp                         #   print list of commands");
    console.log("\tinfo                         #   print information about the system");
}


module.exports = { help, info };

